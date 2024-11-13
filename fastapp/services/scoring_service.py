from typing import Dict, Any, List
import openai
import json
import logging
from models.schemas import ScoringSystem, ScoringResponse
# from utils.pdf import extract_text_from_pdf
from utils.openai import chat_completion_request
# from utils.scoring import calculate_total_score
from core.config import get_settings

settings = get_settings()

async def create_scoring_system(params: Dict[str, Any]) -> ScoringSystem:
    messages = [
        {
            "role": "system",
            "content": "You are a recruiter with 20 years of experience in analyzing resumes against job descriptions. Output JSON.",
        },
        {
            "role": "user",
            "content": f"Here is the job description for the job posting in question: {params['job_description']}. "
                       f"Please generate a list of evaluations for scoring system to be used for this job description."
                       f"Make sure to include these additional considerations to the scoring system: {params.get('custom_considerations', 'None')} "
                       f"There should be AT LEAST 7 separate evaluations to evaluate the job against but no more than 10."
                       f"Strictly adhere to a weight between 0 (unnecessary) & 10 (absolutely necessary)"
        }
    ]

    response = await chat_completion_request(messages, settings.OPENAI_MODEL, tools=settings.TOOLS_SCORING,
                                       tool_choice={"type": "function", "function": {"name": "get_scoring_system"}})

    if response and response.choices and response.choices[0].message.tool_calls:
        try:
            raw_scoring_system = json.loads(response.choices[0].message.tool_calls[0].function.arguments)
            logging.info(f"Raw scoring system received: {raw_scoring_system}")

            if "scoring_system" in raw_scoring_system:
                criteria = []
                for i, criterion in enumerate(raw_scoring_system["scoring_system"]):
                    if "type" in criterion and "weight" in criterion and "evaluation" in criterion:
                        criteria.append({
                            "id": f'ID_{criterion["type"][0].upper()}{i}',
                            "type": criterion["type"],
                            "description": criterion["evaluation"],
                            "weight": criterion["weight"]
                        })
                    else:
                        logging.error("Invalid criterion format - missing required fields")
                        continue

                return ScoringSystem(criteria=criteria)
            else:
                logging.error("Invalid scoring system format - missing scoring_system key")
                return None

        except Exception as e:
            logging.error(f"Error parsing scoring system: {e}")
            return None

    else:
        return None
