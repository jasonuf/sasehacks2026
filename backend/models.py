from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, List
from datetime import datetime, date
from enum import Enum
import re


# ── Enums ────────────────────────────────────────────────────────────────────

class Frequency(str, Enum):
    daily = "daily"
    every_2_days = "every_2_days"
    every_3_days = "every_3_days"
    weekends = "weekends"


# ── Auth ─────────────────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    email: EmailStr
    username: str
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserPublic(BaseModel):
    id: str
    email: str
    username: str


# ── Tasks ─────────────────────────────────────────────────────────────────────

class TaskCreate(BaseModel):
    title: str
    frequency: Frequency
    start_time: str = "08:00"       # HH:MM, 24-hour
    anchor_date: Optional[date] = None  # interval anchor; defaults to today in route

    @field_validator("start_time")
    @classmethod
    def validate_start_time(cls, v: str) -> str:
        if not re.match(r"^\d{2}:\d{2}$", v):
            raise ValueError("start_time must be HH:MM")
        h, m = map(int, v.split(":"))
        if not (0 <= h <= 23 and 0 <= m <= 59):
            raise ValueError("Invalid time value")
        return v


class TaskResponse(BaseModel):
    id: str
    title: str
    frequency: Frequency
    start_time: str
    anchor_date: Optional[str]      # ISO date string, None for weekends
    next_due_at: datetime
    is_overdue: bool


# ── Friends ───────────────────────────────────────────────────────────────────

class AddFriendRequest(BaseModel):
    email: EmailStr


class MissedTask(BaseModel):
    title: str
    overdue_since: datetime


class FriendMissed(BaseModel):
    friend_email: str
    friend_username: str
    missed_tasks: List[MissedTask]
