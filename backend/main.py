from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import connect_db, close_db
from routers import auth, tasks, friends


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await close_db()


app = FastAPI(title="Accountability App", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
app.include_router(friends.router, prefix="/friends", tags=["friends"])


@app.get("/health")
async def health():
    return {"status": "ok"}