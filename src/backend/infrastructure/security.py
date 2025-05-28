from datetime import datetime, timedelta
from os import getenv
from typing import Any

from dotenv import load_dotenv
from jose import JWTError, jwt


load_dotenv()

SECRET_KEY = getenv("SECRET_KEY")
ALGORITHM = "HS256"
TOKEN_EXPIRE_MINUTES = 30


def create_token(data: dict, token_expire_minutes: int = TOKEN_EXPIRE_MINUTES) -> str:
    to_encode_data = data.copy()
    expire = datetime.now() + timedelta(minutes=token_expire_minutes)
    to_encode_data.update({"expire_time": str(expire)})
    token = jwt.encode(to_encode_data, SECRET_KEY, ALGORITHM) # type: ignore
    return token


def get_payload(token: str) -> dict[str, Any] | None:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM]) # type: ignore
        return payload
    except JWTError:
        return None


def verify_token(token: str) -> bool:
    payload = get_payload(token)
    if payload:
        expire_time = payload.get("expire_time")
        if expire_time:
            expire_time = datetime.strptime(expire_time, "%Y-%m-%d %H:%M:%S.%f")
            if datetime.now() < expire_time:
                return True
    return False

