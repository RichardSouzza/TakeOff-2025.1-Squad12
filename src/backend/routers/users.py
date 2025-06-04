from typing import Annotated

from fastapi import APIRouter, Depends, Request
from sqlmodel import Session, select

from infrastructure.database import get_session
from infrastructure.security import create_token
from models import *


router = APIRouter(prefix="/api/users", tags=["Users"])

SessionDep = Annotated[Session, Depends(get_session)]


@router.get("/users/phones", summary="Returns the phone numbers of all users")
async def users_phones(request: Request, session: SessionDep): 
    query = select(User)
    users = session.exec(query).all()
    return [user.phone for user in users]

