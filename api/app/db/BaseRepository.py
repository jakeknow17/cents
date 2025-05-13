from typing import Sequence, Type

from sqlmodel import Session, select, SQLModel


class BaseRepository[T: SQLModel]:
    def __init__(self, model: Type[T]) -> None:
        self.model = model

    @staticmethod
    def create(session: Session, new: T) -> T:
        session.add(new)
        session.commit()
        session.refresh(new)
        return new

    def get_by_id(self, session: Session, _id: int) -> T | None:
        obj = session.get(self.model, _id)
        if not obj:
            return None
        return obj

    def get_many(self, session: Session, offset: int, limit: int) -> Sequence[T]:
        return session.exec(select(self.model).offset(offset).limit(limit)).all()

    def delete_by_id(self, session: Session, _id: int) -> T | None:
        obj = session.get(self.model, _id)
        if not obj:
            return None
        session.delete(obj)
        session.commit()
        return obj
