from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from typing import List

from database import get_db
from models import AddFriendRequest, FriendMissed, MissedTask
from auth import get_current_user

router = APIRouter()


@router.post("", status_code=204)
async def add_friend(
    body: AddFriendRequest,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
):
    # Make sure the friend exists
    friend = await db.users.find_one({"email": body.email})
    if not friend:
        raise HTTPException(status_code=404, detail="No user found with that email")

    if body.email == current_user["email"]:
        raise HTTPException(status_code=400, detail="You can't add yourself")

    if body.email in current_user.get("friend_emails", []):
        raise HTTPException(status_code=409, detail="Already friends")

    await db.users.update_one(
        {"_id": current_user["_id"]},
        {"$addToSet": {"friend_emails": body.email}},
    )


@router.get("", response_model=List[str])
async def list_friends(
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
):
    """Return the list of friend emails for the current user."""
    return current_user.get("friend_emails", [])


@router.get("/missed", response_model=List[FriendMissed])
async def get_missed(
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
):
    """
    Core route — returns every friend who has at least one overdue task.
    Frontend polls this on every page load to decide whether to show the banner.
    """
    friend_emails = current_user.get("friend_emails", [])
    if not friend_emails:
        return []

    # Fetch all friend user docs
    cursor = db.users.find({"email": {"$in": friend_emails}})
    friends = await cursor.to_list(length=200)

    now = datetime.utcnow()
    result: List[FriendMissed] = []

    for friend in friends:
        friend_id = str(friend["_id"])

        # Find all overdue tasks for this friend
        overdue_cursor = db.tasks.find(
            {"user_id": friend_id, "next_due_at": {"$lt": now}}
        )
        overdue_tasks = await overdue_cursor.to_list(length=100)

        if overdue_tasks:
            result.append(
                FriendMissed(
                    friend_email=friend["email"],
                    friend_username=friend["username"],
                    missed_tasks=[
                        MissedTask(title=t["title"], overdue_since=t["next_due_at"])
                        for t in overdue_tasks
                    ],
                )
            )

    return result