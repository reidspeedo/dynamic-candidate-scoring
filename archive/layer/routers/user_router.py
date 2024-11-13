from fastapi import APIRouter, HTTPException, status
from layer.services.user_services import UserService
from layer.schemas.user_schemas import User, UserResponse

router = APIRouter()
user_service = UserService()


@router.post("/users/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: User):
    result = user_service.create_user(user)
    if result.is_failure:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=result.error)
    return result.value


@router.get("/users/{user_id}", response_model=UserResponse)
def read_user(user_id: int):
    result = user_service.get_user(user_id)
    if result.is_failure:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=result.error)
    return result.value


@router.put("/users/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user: User):
    result = user_service.update_user(user_id, user)
    if result.is_failure:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=result.error)
    return result.value


@router.delete("/users/{user_id}")
def delete_user(user_id: int):
    result = user_service.delete_user(user_id)
    if result.is_failure:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=result.error)
    return result.value
