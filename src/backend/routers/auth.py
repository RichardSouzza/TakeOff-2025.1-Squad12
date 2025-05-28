from typing import Annotated

from fastapi import APIRouter, Depends, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlmodel import Session, select

from infrastructure.database import get_session
from infrastructure.security import create_token
from models import *


router = APIRouter(tags=["Authentication"])

SessionDep = Annotated[Session, Depends(get_session)]


@router.post("/signup", summary="User signup")
async def signup(request: Request, session: SessionDep, user: UserCreate):
    user = User.from_orm(user)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@router.get("/signin", summary="User signin")
async def signin(request: Request, session: SessionDep, form: Annotated[LoginForm, Depends()]): 
    query = select(User) \
            .where(User.username == form.username and \
                   User.password == form.password)

    user = session.exec(query).first()

    if user:
        token = create_token({"name": user.name})
        return token

    raise HTTPException(status_code=400, detail="Incorrect username or password")

