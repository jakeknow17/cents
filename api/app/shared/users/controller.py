from typing import Annotated

from fastapi import APIRouter, Query

from app.db.session import SessionDep
from app.shared.users.model import User
from app.shared.users.repository import UserRepositoryDep

user_router = APIRouter(prefix="/users", tags=["users"], )


@user_router.post("/")
async def create_user(user: User, session: SessionDep, repo: UserRepositoryDep):
    repo.create(session, user)
    return user


@user_router.get("/")
async def get_users(session: SessionDep, repo: UserRepositoryDep, offset: int = 0,
                    limit: Annotated[int, Query(le=100)] = 100):
    return repo.get_many(session, offset, limit)


@user_router.get("/{user_id}")
async def get_user(user_id: int, session: SessionDep, repo: UserRepositoryDep):
    return repo.get_by_id(session, user_id)


@user_router.delete("/{user_id}")
async def delete_user(user_id: int, session: SessionDep, repo: UserRepositoryDep):
    return repo.delete_by_id(session, user_id)
