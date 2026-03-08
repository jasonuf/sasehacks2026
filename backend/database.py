import motor.motor_asyncio
from typing import Optional
import os
from dotenv import load_dotenv
load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "accountability_app")

client: Optional[motor.motor_asyncio.AsyncIOMotorClient] = None
db = None


async def connect_db():
    global client, db
    client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]

    # Create indexes
    await db.users.create_index("email", unique=True)
    await db.tasks.create_index("user_id")
    await db.tasks.create_index("next_due_at")
    await db.checkins.create_index([("task_id", 1), ("checked_at", -1)])

    print(f"Connected to MongoDB: {DB_NAME}")


async def close_db():
    global client
    if client:
        client.close()
        print("MongoDB connection closed")


def get_db():
    return db