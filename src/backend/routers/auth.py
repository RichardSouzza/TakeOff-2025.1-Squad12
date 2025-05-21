from fastapi import APIRouter, Request

from backend.models import UserDto


router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/signup", summary="User signup")
async def signup(request: Request, user: UserDto):

    return {"message": "User signed up successfully"}
