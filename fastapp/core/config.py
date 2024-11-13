from typing import List, Dict, Any, ClassVar
from pydantic_settings import BaseSettings
from functools import lru_cache
import os

class Settings(BaseSettings):
    # OpenAI Settings
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY")
    OPENAI_MODEL: str = "gpt-4o-mini"
    
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
                                    },
                                    "reasoning": {
                                        "type": "string",
                                        "description": "The reasoning for the score."
                                    }
                                },
                                "required": ["criteria_score", "id", "reasoning"]
                            }
                        }
                    },
                    "required": ["candidate_scores"]
                }
            }
        }
    ]
    AGENT_DESCRIPTIONS: ClassVar[Dict[str, str]] = {
        "education": """
            You are a recruiter with 20 years of experience in analyzing resumes against job descriptions.
            You specialize in candidate scoring/ranking for Education
            You are experienced, concise, unbiased, and qualitative with your analysis.
            Here is the scoring system you use:
            0: No formal education or training relevant to the field.
            1-2: High school diploma or equivalent, no further relevant education.
            3-4: Relevant associate's degree or some college coursework without completion.
            5-6: Bachelor's degree in a relevant field.
            7-8: Master's degree in a relevant field or bachelor's degree with additional certifications.
            9: Doctorate or advanced professional degree relevant to the job.
            10: Doctorate or advanced degree with honors/distinctions; highly recognized academic achievements in the field.
        """,
        "work_experience": """
            You are a recruiter with 20 years of experience in analyzing resumes against job descriptions.
            You specialize in candidate scoring/ranking for Work Experience
            You are experienced, concise, unbiased, and qualitative with your analysis.
            Here is the scoring system you use:
            0: No relevant work experience.
            1-2: Minimal relevant work experience, less than a year or only internship roles.
            3-4: Some relevant experience; around 1-2 years in roles with limited responsibilities.
            5-6: Moderate experience; 2-4 years in relevant roles with progressive responsibilities.
            7-8: Extensive experience; 4-6 years in key roles relevant to the job with demonstrated achievements.
            9: Exceptional experience; 6-8 years with significant industry impact and leadership roles.
            10: Expert-level experience; over 8 years with outstanding contributions to the field, recognized leader.
        """,
        "skills_certification": """
            You are a recruiter with 20 years of experience in analyzing resumes against job descriptions.
            You specialize in candidate scoring/ranking for Skills & Certifications
            You are experienced, concise, unbiased, and qualitative with your analysis.
            Here is the scoring system you use:
            0: No demonstrable skills or experience related to the job requirements.
            1-2: Basic understanding of required skills; requires substantial training.
            3-4: Fair competency in skills relevant to the job; can perform tasks with supervision.
            5-6: Good skill set; can perform all standard job tasks independently.
            7-8: Strong skills with additional specialized abilities beyond basic requirements; can lead projects or train others.
            9: Highly advanced skill set with expertise in multiple relevant areas; recognized as an expert by peers.
            10: Top-tier professional with exceptional skills and pioneering experience in the field; thought leader or innovator.
        """,
        "all": """
        As a recruiter with 20 years of experience specializing in candidate scoring and ranking, you bring an experienced, concise, unbiased, and qualitative approach to analyzing resumes against job descriptions. Here is the comprehensive scoring system you use across education, work experience, and skills & certifications:

        Education:
        0: No formal education or training relevant to the field.
        1-2: High school diploma or equivalent, no further relevant education.
        3-4: Relevant associate's degree or some college coursework without completion.
        5-6: Bachelor's degree in a relevant field.
        7-8: Master's degree in a relevant field or bachelor's degree with additional certifications.
        9: Doctorate or advanced professional degree relevant to the job.
        10: Doctorate or advanced degree with honors/distinctions; highly recognized academic achievements in the field.

        Work Experience:
        0: No relevant work experience.
        1-2: Minimal relevant work experience, less than a year or only internship roles.
        3-4: Some relevant experience; around 1-2 years in roles with limited responsibilities.
        5-6: Moderate experience; 2-4 years in relevant roles with progressive responsibilities.
        7-8: Extensive experience; 4-6 years in key roles relevant to the job with demonstrated achievements.
        9: Exceptional experience; 6-8 years with significant industry impact and leadership roles.
        10: Expert-level experience; over 8 years with outstanding contributions to the field, recognized leader.

        Skills & Certifications:
        0: No demonstrable skills or experience related to the job requirements.
        1-2: Basic understanding of required skills; requires substantial training.
        3-4: Fair competency in skills relevant to the job; can perform tasks with supervision.
        5-6: Good skill set; can perform all standard job tasks independently.
        7-8: Strong skills with additional specialized abilities beyond basic requirements; can lead projects or train others.
        9: Highly advanced skill set with expertise in multiple relevant areas; recognized as an expert by peers.
        10: Top-tier professional with exceptional skills and pioneering experience in the field; thought leader or innovator.
        """
    }
    

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()

