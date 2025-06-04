from typing import Optional

from pydantic import BaseModel
from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    __tablename__ = "tb_user"

    id:          Optional[int] = Field(default=None, primary_key=True)
    name:        str  = Field(nullable=False               )
    username:    str  = Field(nullable=False, index=True   )
    password:    str  = Field(nullable=False               )
    phone:       str  = Field(nullable=True                )
    fl_excluded: bool = Field(nullable=False, default=False)


class UserCreate(SQLModel):
    name:     str
    username: str
    password: str
    phone:    Optional[str] = None


class LoginForm(SQLModel):
    username: str
    password: str

