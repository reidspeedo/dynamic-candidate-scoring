from fastapi import APIRouter, HTTPException
from services.user_services import UserService
from api.routers.v1.users.user_schemas import User, UserResponse

router = APIRouter()
user_service = UserService()


@router.post("/users/", response_model=UserResponse)
def create_user(user: User):
    return user_service.create_user(user)


@router.get("/users/{user_id}", response_model=UserResponse)
def read_user(user_id: int):
    user = user_service.get_user(user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/users/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user: User):
    db_user = user_service.get_user(user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user_service.update_user(user_id, user.dict())


@router.delete("/users/{user_id}")
def delete_user(user_id: int):
    db_user = user_service.get_user(user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user_service.delete_user(db_user)
