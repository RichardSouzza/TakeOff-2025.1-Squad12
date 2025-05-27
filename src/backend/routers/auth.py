from typing import Annotated

from fastapi import APIRouter, Depends, Request
from sqlmodel import Session

from infrastructure.database import get_session
from models import *


router = APIRouter(prefix="/auth", tags=["Authentication"])

SessionDep = Annotated[Session, Depends(get_session)]


@router.post("/signup", summary="User signup")
async def signup(request: Request, session: SessionDep, user: UserCreate):
    user = User.from_orm(user)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

