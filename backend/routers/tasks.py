from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timedelta, time, date as date_type
from bson import ObjectId
from typing import List

from database import get_db
from models import TaskCreate, TaskResponse, Frequency
from auth import get_current_user

router = APIRouter()

INTERVAL_DAYS = {
    Frequency.daily: 1,
    Frequency.every_2_days: 2,
    Frequency.every_3_days: 3,
}


def compute_next_due(frequency: Frequency, start_time: str, anchor_date: date_type) -> datetime:
    hour, minute = map(int, start_time.split(":"))
    now = datetime.utcnow()

    if frequency == Frequency.weekends:
        # Find the next Saturday (5) or Sunday (6) after now
        today = now.date()
        for i in range(1, 8):
            candidate_date = today + timedelta(days=i)
            if candidate_date.weekday() in (5, 6):
                candidate = datetime.combine(candidate_date, time(hour, minute))
                if candidate > now:
                    return candidate
        # Fallback: next Saturday
        days_until_sat = (5 - today.weekday()) % 7 or 7
        return datetime.combine(today + timedelta(days=days_until_sat), time(hour, minute))

    interval = INTERVAL_DAYS[frequency]
    anchor = datetime.combine(anchor_date, time(hour, minute))

    if anchor > now:
        return anchor

    days_elapsed = (now.date() - anchor_date).days
    n = (days_elapsed // interval) + 1
    next_due = anchor + timedelta(days=n * interval)

    # Safety: ensure strictly after now
    while next_due <= now:
        next_due += timedelta(days=interval)

    return next_due


def format_task(task: dict) -> TaskResponse:
    return TaskResponse(
        id=str(task["_id"]),
        title=task["title"],
        frequency=task["frequency"],
        start_time=task.get("start_time", "08:00"),
        anchor_date=task.get("anchor_date"),  # already stored as ISO string or None
        next_due_at=task["next_due_at"],
        is_overdue=task["next_due_at"] < datetime.utcnow(),
    )


@router.get("", response_model=List[TaskResponse])
async def get_tasks(
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
):
    cursor = db.tasks.find({"user_id": str(current_user["_id"])})
    tasks = await cursor.to_list(length=100)
    return [format_task(t) for t in tasks]


@router.post("", response_model=TaskResponse, status_code=201)
async def create_task(
    body: TaskCreate,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
):
    anchor = body.anchor_date or datetime.utcnow().date()
    next_due = compute_next_due(body.frequency, body.start_time, anchor)

    doc = {
        "user_id": str(current_user["_id"]),
        "title": body.title,
        "frequency": body.frequency,
        "start_time": body.start_time,
        "anchor_date": anchor.isoformat() if body.frequency != Frequency.weekends else None,
        "next_due_at": next_due,
        "created_at": datetime.utcnow(),
    }
    result = await db.tasks.insert_one(doc)
    doc["_id"] = result.inserted_id
    return format_task(doc)


@router.delete("/{task_id}", status_code=204)
async def delete_task(
    task_id: str,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
):
    result = await db.tasks.delete_one(
        {"_id": ObjectId(task_id), "user_id": str(current_user["_id"])}
    )
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")


@router.delete("/{task_id}/checkin", response_model=TaskResponse)
async def uncheckin_task(
    task_id: str,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
):
    task = await db.tasks.find_one(
        {"_id": ObjectId(task_id), "user_id": str(current_user["_id"])}
    )
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Remove the most recent checkin for this task
    await db.checkins.find_one_and_delete(
        {"task_id": task_id, "user_id": str(current_user["_id"])},
        sort=[("checked_at", -1)],
    )

    # Push next_due_at into the past so the task appears overdue
    overdue_at = datetime.utcnow() - timedelta(seconds=1)
    await db.tasks.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": {"next_due_at": overdue_at}},
    )

    task["next_due_at"] = overdue_at
    return format_task(task)


@router.post("/{task_id}/checkin", response_model=TaskResponse)
async def checkin_task(
    task_id: str,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
):
    task = await db.tasks.find_one(
        {"_id": ObjectId(task_id), "user_id": str(current_user["_id"])}
    )
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    now = datetime.utcnow()
    anchor_raw = task.get("anchor_date")
    anchor = date_type.fromisoformat(anchor_raw) if anchor_raw else now.date()
    start_time = task.get("start_time", "08:00")
    next_due = compute_next_due(task["frequency"], start_time, anchor)

    await db.checkins.insert_one(
        {"task_id": task_id, "user_id": str(current_user["_id"]), "checked_at": now}
    )
    await db.tasks.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": {"next_due_at": next_due}},
    )

    task["next_due_at"] = next_due
    return format_task(task)
