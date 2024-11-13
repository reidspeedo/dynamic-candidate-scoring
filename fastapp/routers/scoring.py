from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from typing import List, Optional
from fastapp.models.schemas import ScoringResponse, ScoringSystem
from fastapp.services.scoring_service import create_scoring_system, score_resumes
import logging

router = APIRouter(prefix="/api/v1", tags=["scoring"])

@router.post("/scoring-system", response_model=ScoringSystem)
async def generate_scoring_system(
    job_description: str = Form(...),
    custom_considerations: Optional[str] = Form(None)
):
    """Generate a scoring system based on job description and custom considerations"""
    try:
        return await create_scoring_system({
            "job_description": job_description,
            "custom_considerations": custom_considerations
        })
    except Exception as e:
        logging.error(f"Error generating scoring system: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate scoring system")

@router.post("/score", response_model=List[ScoringResponse])
async def score_candidates(
    scoring_system: str = Form(...),
    resumes: List[UploadFile] = File(...)
):
    """Score uploaded resumes against the scoring system"""
    if not resumes:
        raise HTTPException(status_code=400, detail="No resumes provided")

    try:
        return await score_resumes({
            "scoring_system": ScoringSystem.parse_raw(scoring_system),
            "resumes": resumes
        })
    except Exception as e:
        logging.error(f"Error scoring resumes: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to score resumes") 