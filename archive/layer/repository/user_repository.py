from layer.schemas.user_schemas import User
from sqlalchemy.exc import IntegrityError
from layer.repository.config import SessionLocal
from layer.models.user_models import UserSQL
from core.utils.utils import Result


class UserRepository:
    @staticmethod
    def create_user(user_data: User) -> Result:
        db = SessionLocal()
        user = UserSQL(**user_data.dict())
        try:
            db.add(user)
            db.commit()
            db.refresh(user)
            return Result(value=user)
        except IntegrityError as e:
            db.rollback()
            return Result(error=str(e.orig))
        finally:
            db.close()

    @staticmethod
    def get_user(user_id: int) -> Result:
        db = SessionLocal()
        user = db.query(UserSQL).filter(UserSQL.user_id == user_id).first()
        db.close()
        if not user:
            return Result(error="User not found")
        return Result(value=user)

    @staticmethod
    def update_user(user_id: int, updated_user_data: User) -> Result:
        db = SessionLocal()
        try:
            user = db.query(UserSQL).filter(UserSQL.user_id == user_id).first()
            if not user:
                return Result(error="User not found")
            for key, value in updated_user_data.dict().items():
                setattr(user, key, value)
            db.commit()
            db.refresh(user)
            return Result(value=user)
        except IntegrityError as e:
            db.rollback()
            return Result(error=str(e.orig))
        finally:
            db.close()

    @staticmethod
    def delete_user(user_id: int) -> Result:
        db = SessionLocal()
        try:
            user = db.query(UserSQL).filter(UserSQL.user_id == user_id).first()
            if not user:
                return Result(error="User not found")
            db.delete(user)
            db.commit()
            return Result(value="User deleted successfully")
        finally:
            db.close()
