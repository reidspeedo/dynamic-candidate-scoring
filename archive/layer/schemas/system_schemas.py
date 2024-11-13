from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class ScoringSystem(Base):
    __tablename__ = 'scoring_systems'

    scoring_system_id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    job_title = Column(String, nullable=False)
    job_description = Column(String, nullable=True)
    custom_considerations = Column(String, nullable=True)
    scoring_system = Column(JSONB, nullable=False)
    user_id = Column(Integer, ForeignKey('users.user_id'), nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
