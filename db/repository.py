from .models import UserSQL
from .database import SessionLocal
from api.routers.v1.users.user_schemas import User


class UserRepository:
    @staticmethod
    def get_user(user_id: int) -> User:
        db = SessionLocal()
        try:
            return db.query(UserSQL).filter(UserSQL.user_id == user_id).first()
        finally:
            db.close()

    @staticmethod
    def create_user(user_data: User) -> User:
        db = SessionLocal()
        try:
            user = UserSQL(**user_data.dict())
            db.add(user)
            db.commit()
            db.refresh(user)
            return user
        finally:
            db.close()

    @staticmethod
    def update_user(user_id: int, updated_user_data: User) -> User:
        db = SessionLocal()
        try:
            user = db.query(UserSQL).filter(UserSQL.user_id == user_id).first()
            if user:
                for key, value in updated_user_data.items():
                    setattr(user, key, value)
                db.commit()
                db.refresh(user)
            return user
        finally:
            db.close()

    @staticmethod
    def delete_user(user: User):
        db = SessionLocal()
        try:
            db.delete(user)
            db.commit()
            return {user.user_id}
        finally:
            db.close()
