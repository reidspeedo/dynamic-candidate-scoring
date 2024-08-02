from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from db.users.user_models import Base

SQLALCHEMY_DATABASE_URL = "postgresql://reidrelatores:aurora@localhost/dynamiccandidate"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(engine)
