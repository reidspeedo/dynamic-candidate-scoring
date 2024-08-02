from db.users.user_repository import UserRepository
from api.routers.users.user_schemas import User
from utils.utils import Result


class UserService:
    def __init__(self, repository: UserRepository = UserRepository()):
        self.repository = repository

    def get_user(self, user_id: int) -> Result:
        return self.repository.get_user(user_id)

    def create_user(self, user: User) -> Result:
        return self.repository.create_user(user)

    def update_user(self, user_id: int, user: User) -> Result:
        return self.repository.update_user(user_id, user)

    def delete_user(self, user_id: int) -> Result:
        return self.repository.delete_user(user_id)
