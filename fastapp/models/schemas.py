from pydantic import BaseModel, Field
from typing import List, Optional
from uuid import UUID, uuid4

class ScoringCriterion(BaseModel):
    id: str = Field(default_factory=lambda: f"crit_{uuid4().hex[:8]}")
    type: str
    description: str
    weight: int = Field(ge=1, le=10)

class ScoringSystem(BaseModel):
    criteria: List[ScoringCriterion]

class CriterionScore(BaseModel):
    criterion_id: str
    score: int = Field(ge=0, le=10)
    explanation: str

class ScoringResponse(BaseModel):
    resume_id: UUID = Field(default_factory=uuid4)
    resume_name: str
    scores: List[CriterionScore]
    total_score: float
    ranking_explanation: str
