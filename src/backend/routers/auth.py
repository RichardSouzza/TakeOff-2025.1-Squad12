from typing import Annotated

from fastapi import APIRouter, Depends, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlmodel import Session, select

from infrastructure.database import get_session
from infrastructure.security import create_token, encrypt_password, verify_password
from models import *


router = APIRouter(prefix="/api/auth", tags=["Authentication"])

SessionDep = Annotated[Session, Depends(get_session)]


@router.post("/signup", summary="User signup")
async def signup(request: Request, session: SessionDep, user: UserCreate):
    user = User.from_orm(user)
    user.password = encrypt_password(user.password)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@router.get("/signin", summary="User signin")
async def signin(request: Request, session: SessionDep, form: Annotated[LoginForm, Depends()]):
    query = select(User) \
            .where(User.username == form.username and \
                   verify_password(form.password, User.password))

    user = session.exec(query).first()

    if user:
        token = create_token({"name": user.name})
        return token

    raise HTTPException(status_code=400, detail="Incorrect username or password")
