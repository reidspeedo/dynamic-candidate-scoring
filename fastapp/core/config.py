from typing import List, Dict, Any, ClassVar
from pydantic_settings import BaseSettings
from functools import lru_cache
import os

class Settings(BaseSettings):
    # OpenAI Settings
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY")
    OPENAI_MODEL: str = "gpt-3.5-turbo"
    
    # API Settings
    API_V1_STR: str = "/api/v1"
    
    # CORS Settings
    ALLOWED_ORIGINS: list = ["*"]
    
    # Tools Configuration
    TOOLS_RESUME: ClassVar[List[Dict[str, Any]]] = [{
        'type': 'function',
        'function': {
            'name': 'parse_resume',
            'description': "Retrieves contact information, Work Experience, Education, and Skills & Certifications from a candidate's resume.",
            'parameters': {
                'type': 'object',
                'properties': {
                    'contact_information': {
                        'type': 'object',
                        'description': 'Contact information of the candidate.',
                        'properties': {
                            'name': {'type': 'string', 'description': 'First and last name of the candidate.'},
                            'email': {'type': 'string', 'description': 'Email address of the candidate.'},
                            'phone_number': {'type': 'string', 'description': 'Phone number of the candidate.'}
                        },
                        'required': ['name', 'email', 'phone_number']
                    },
                    'work_experience': {
                        'type': 'array',
                        'description': 'List of work experiences from the resume.',
                        'items': {'type': 'string'}
                    },
                    'education': {
                        'type': 'array',
                        'description': 'List of educational qualifications from the resume.',
                        'items': {'type': 'string'}
                    },
                    'skills_certification': {
                        'type': 'array',
                        'description': 'List of skills and certifications from the resume.',
                        'items': {'type': 'string'}
                    }
                },
                'required': ['contact_information', 'work_experience', 'education', 'skills_certification']
            }
        }
    }]
    TOOLS_SCORING: ClassVar[List[Dict[str, Any]]] = [{
        "type": "function",
        "function": {
            "name": "get_scoring_system",
            "description": "Generate a candidate scoring system based on a job description and additional considerations.",
            "parameters": {
                "type": "object",
                "properties": {
                    "scoring_system": {
                        "type": "array",
                        "description": "A list of criteria (based on the job description and additional considerations) for the scoring system to use",
                        "items": {
                            "type": "object",
                            "properties": {
                                "type": {
                                    "type": "string",
                                    "enum": ["work_experience", "education", "skills_certification"],
                                    "description": "The category should be one of the following: work_experience, education, or skills_certification"
                                },
                                "weight": {
                                    "type": "number",
                                    "description": "The weight assigned to this category, between 0 and 10."
                                },
                                "evaluation": {
                                    "type": "string",
                                    "description": "The evaluation criteria (i.e, 10 years of Python experience)"
                                }
                            },
                            "required": ["type", "weight", "evaluation"]
                        }
                    }
                },
                "required": ["scoring_system"]
            }
        }
    },
        {
            "type": "function",
            "function": {
                "name": "get_candidate_score",
                "description": "Generate candidate scores and rationales based on each input evaluation",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "candidate_scores": {
                            "type": "array",
                            "description": "An array of candidate scores and their corresponding rationales",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "criteria_score": {
                                        "type": "number",
                                        "description": "The score (0-10) awarded for this evaluation."
                                    },
                                    "id": {
                                        "type": "string",
                                        "description": "The ID assigned to the input evaluation."
                                    }
                                },
                                "required": ["criteria_score", "id"]
                            }
                        }
                    },
                    "required": ["candidate_scores"]
                }
            }
        }
    ]
    

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()
