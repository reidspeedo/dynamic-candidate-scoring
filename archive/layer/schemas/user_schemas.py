from datetime import datetime
from pydantic import BaseModel


class User(BaseModel):
    email: str
    username: str
    password: str
    name: str


class UserResponse(BaseModel):
    user_id: int
    email: str
    username: str
    name: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
