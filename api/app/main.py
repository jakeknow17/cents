from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.db.session import create_db_and_tables
from app.shared.users.controller import user_router


@asynccontextmanager
async def lifespan(_app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan)
app.include_router(user_router)


@app.get("/")
async def root():
    return {"message": "Hello World"}
