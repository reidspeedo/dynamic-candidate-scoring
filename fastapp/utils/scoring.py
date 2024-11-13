from typing import List
from fastapp.models.schemas import CriterionScore, ScoringCriterion

def calculate_total_score(
    scores: List[CriterionScore],
    criteria: List[ScoringCriterion]
) -> float:
    """Calculate weighted total score"""
    total_weighted_score = 0
    total_weight = 0
    
    for score in scores:
        criterion = next(c for c in criteria if c.id == score.criterion_id)
        total_weighted_score += score.score * criterion.weight
        total_weight += criterion.weight
    
    return (total_weighted_score / total_weight) if total_weight > 0 else 0 