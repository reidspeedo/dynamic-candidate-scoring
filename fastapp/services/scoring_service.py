from typing import Dict, Any, List
import openai
import json
import logging
from fastapp.models.schemas import ScoringSystem, ScoringResponse
from fastapp.utils.pdf import extract_text_from_pdf
from fastapp.utils.openai import chat_completion_request
from fastapp.core.config import get_settings

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

async def score_resumes(data: Dict) -> List[ScoringResponse]:
    scoring_system = data["scoring_system"]
    resumes = data["resumes"]
    
    scored_candidates = []
    
    for resume in resumes:
        # Extract text from the PDF
        resume_text = await extract_text_from_pdf(resume)
        
        # Get scores from OpenAI
        scores = await get_criteria_scores(scoring_system, resume_text)
        

        if not scores:
            continue
            
        # Merge scores with scoring system
        all_scores = merge_score(scores, scoring_system)
        
        # Calculate final normalized score
        final_score = calculate_final_score(all_scores)
        
        scored_candidates.append(ScoringResponse(
            resume_name=resume.filename,
            total_score=final_score,
            scores=[{
                "criterion_id": score["id"],
                "score": score["criteria_score"], 
                "reasoning": score.get("reasoning", ""),
                "area": score["type"],
                "weight": score["weight"],
                "evaluation": score["evaluation"],
            } for score in all_scores]
        ))
    
    # Sort candidates by total score in descending order
    scored_candidates.sort(key=lambda x: x.total_score, reverse=True)

    # TO BE DELETED ############################################################
    
    print("\nDetailed Candidate Leaderboard\n" + "=" * 80)
    
    # for i, application in enumerate(scored_candidates, start=1):
    #     print(f"\nRank {i}:")
    #     print("-" * 80)
    #     print(f"Resume: {application.resume_name}")
    #     print(f"Total Score: {round(application.total_score)} / 100")
    #     print("\nDetailed Scores:")
    #     print("-" * 40)
        
    #     # Print individual criterion scores
    #     for score in application.scores:
    #         print(f"\nArea: {score.area}")
    #         print(f"Evaluation Criteria: {score.evaluation}")
    #         print(f"Weight: {score.weight}/10")
    #         print(f"Score: {score.score}/10")
    #         if score.reasoning:
    #             print(f"Reasoning: {score.reasoning}")
    #     print("=" * 80)

    # print("\nEnd of Detailed Leaderboard")

    print(scored_candidates)

    ############################################################################
    return scored_candidates

async def get_criteria_scores(scoring_system: Dict, resume_text: str) -> Dict:
    """Get scores for each criterion using OpenAI"""
    
    prompt = generate_evaluation_json(scoring_system)
    messages = [
        {
            "role": "system",
            "content": settings.AGENT_DESCRIPTIONS["all"] + "Output JSON."
        },
        {
            "role": "user",
            "content": f"Here is the candidate's resume: {resume_text}\n"
                      f"Here is a list of criteria to evaluate the resume: {scoring_system}\n"
                      f"For each criteria, provide a candidate score (0-10), "
                      f"and the ID associated with the evaluation.\n"
                      f"Here is a template that you MUST use. "
                      f"You are REQUIRED to fill out sections in []. {prompt}"
        }
    ]

    response = await chat_completion_request(
        messages, 
        settings.OPENAI_MODEL, 
        tools=settings.TOOLS_SCORING,
        tool_choice={"type": "function", "function": {"name": "get_candidate_score"}}
    )
    
    if response and response.choices:
        return json.loads(response.choices[0].message.tool_calls[0].function.arguments)
    return None

def generate_evaluation_json(scoring_system: Dict) -> str:
    """Generate evaluation JSON template"""
    results = []

    # print(scoring_system)

    for criterion in scoring_system.criteria:
        # print(criterion)
        evaluation_json = {
            'id': criterion.id,
            'criteria_score': "[INSERT CANDIDATE SCORE HERE]",
        }
        results.append(evaluation_json)

    return json.dumps(results, indent=4)


def merge_score(candidate_score, scoring_system):
    # Create a dictionary for scoring data for quick lookup
    scoring_dict = {item.id: item for item in scoring_system.criteria}
    
    # Merge candidate scores with scoring data
    merged_data = []
    for candidate in candidate_score['candidate_scores']:
        if candidate['id'] in scoring_dict:
            criterion = scoring_dict[candidate['id']]
            merged_item = {
                'id': candidate['id'],
                'criteria_score': candidate['criteria_score'],
                'type': criterion.type,
                'evaluation': criterion.description,
                'reasoning': candidate.get('reasoning', ''),
                'weight': criterion.weight
            }
            merged_data.append(merged_item)

    return merged_data

def calculate_final_score(all_scores):
    total_score = 0
    total_weight = 0
    max_possible_score = 0

    for score_info in all_scores:
        weighted_score = score_info['criteria_score'] * score_info['weight']
        total_score += weighted_score
        total_weight += score_info['weight']
        max_possible_score += score_info['weight'] * 10

    if total_weight != 0:
        normalized_final_score = total_score / max_possible_score * 100
    else:
        normalized_final_score = 0

    return normalized_final_score
