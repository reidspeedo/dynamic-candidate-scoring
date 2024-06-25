from db.repository import UserRepository
from api.routers.v1.users.user_schemas import User


class UserService:
    def __init__(self, repository: UserRepository = UserRepository()):
        self.repository = repository

    def get_user(self, user_id: int) -> User:
        return self.repository.get_user(user_id)

    def create_user(self, user: User) -> User:
        return self.repository.create_user(user)

    def update_user(self, user_id: int, user: User) -> User:
        return self.repository.update_user(user_id, user)

    def delete_user(self, user: User) -> User:
        return self.repository.delete_user(user)
