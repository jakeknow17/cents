from typing import Annotated

from fastapi import Depends

from app.db.BaseRepository import BaseRepository
from app.shared.users.model import User


class UserRepository(BaseRepository[User]):
    def __init__(self) -> None:
        super().__init__(User)


def get_repository():
    yield UserRepository()


UserRepositoryDep = Annotated[UserRepository, Depends(get_repository)]
