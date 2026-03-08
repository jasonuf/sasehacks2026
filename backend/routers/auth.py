from fastapi import APIRouter, HTTPException, Depends, status
from database import get_db
from models import RegisterRequest, LoginRequest, TokenResponse, UserPublic
from auth import hash_password, verify_password, create_access_token

router = APIRouter()


@router.post("/register", response_model=UserPublic, status_code=201)
async def register(body: RegisterRequest, db=Depends(get_db)):
    existing = await db.users.find_one({"email": body.email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    doc = {
        "email": body.email,
        "username": body.username,
        "password_hash": hash_password(body.password),
        "friend_emails": [],
    }
    result = await db.users.insert_one(doc)

    return UserPublic(
        id=str(result.inserted_id),
        email=body.email,
        username=body.username,
    )


@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest, db=Depends(get_db)):
    user = await db.users.find_one({"email": body.email})

    if not user or not verify_password(body.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token(str(user["_id"]))
    return TokenResponse(access_token=token)