from pydantic import BaseModel


class TokenData(BaseModel):
    name: str
    expire_time: str

