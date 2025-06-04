from sqlmodel import SQLModel

from backend.infrastructure.database import engine


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
