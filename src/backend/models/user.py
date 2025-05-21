from pydantic import BaseModel
from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    id:       int  = Field(nullable=False, primary_key=True)
    name:     str  = Field(nullable=False                  )
    username: str  = Field(nullable=False, index=True      )
    password: str  = Field(nullable=False                  )
    phone:    str  = Field(nullable=True                   )
    excluded: bool = Field(nullable=False, default=False   )


class UserDto(BaseModel):
    name:     str
    username: str
    password: str
    phone:    str | None = None

    class Config:
        orm_mode = True
