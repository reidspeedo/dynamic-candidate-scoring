from utils import chat_completion_request, extract_text_from_pdf, calculate_final_score
from config import tools, model
import os
import uuid
import json
from tqdm import tqdm

def read_file(file_path):
    with open(file_path, "r") as file:
        return file.read().strip()


def get_scoring_system():
    job_description = read_file("job_description.txt")
    custom_considerations = read_file("custom_considerations.txt")
    agent_description = read_file("agent_description.txt")
    messages = [
        {
            "role": "system",
            "content": agent_description,
        },
        {
            "role": "user",
            "content": f"Here is the job description for the job posting in question: {job_description}. "
                       f"Please generate a list of criteria for scoring system to be used for this job description."
                       f"Make sure to include these additional considerations to the scoring system: {custom_considerations} "
                       f"There should be at least 10-12 criterias to evaluate the job against but no more than 15."
                       f"Strictly adhere to a weight between 0 (unnecessary) & 10 (absolutely necessary)"
        }
    ]

    response = chat_completion_request(messages, model, tools=tools,
                                       tool_choice={"type": "function", "function": {"name": "get_scoring_system"}})

    if response:

        scoring_system = json.loads(response.choices[0].message.tool_calls[0].function.arguments)

        # Adding additional fields to the scoring system
        # scoring_system = json.loads(response.choices[0].message.tool_calls[0].function.arguments)
        #
        # for criterion in scoring_system["scoring_system"]:
        #     criterion["id"] = str(uuid.uuid4())  # Generates a unique identifier
        #     criterion["candidate_score"] = 0  # Placeholder for candidate scores
        #     criterion["reasoning"] = "TBD"  # Placeholder for reasoning text

        return scoring_system

    else:
        return None


def get_criteria_score(criteria, resume):
    agent_description = read_file("agent_description.txt")
    messages = [

        {
            "role": "system",
            "content": agent_description
        },
        {
            "role": "user",
            "content": f"Here is the candidate's resume: {resume} that needs to be evaluated. "
                       f"Here is the criteria that I need you to evaluate: {criteria}."
                       f"Please out put only a candidate score (0-10) on how well the resume meets that evaluation and "
                       f"a reasoning (1 short sentence) on why you provided that score."
        }
    ]

    response = chat_completion_request(messages, model, tools=tools,
                                       tool_choice={"type": "function", "function": {"name": "get_candidate_score"}})
    if response:
        return json.loads(response.choices[0].message.tool_calls[0].function.arguments)
    else:
        return None


def get_contact_information(resume):
    agent_description = read_file("agent_description.txt")
    messages = [

        {
            "role": "system",
            "content": agent_description
        },
        {
            "role": "user",
            "content": f"Here is the candidate's resume: {resume}."
                       f"Please retrieve the name of the candidate, email, and phone number. "
                       f"Format the information so it's easy to read."
                       f"Leave field empty if not found in resume."
        }
    ]

    response = chat_completion_request(messages, model, tools=tools,
                                       tool_choice={"type": "function", "function": {"name": "get_contact_details"}})
    if response:
        return json.loads(response.choices[0].message.tool_calls[0].function.arguments)
    else:
        return None

def simulate_test_mode():
    # Use hardcoded scoring system for test mode
    scoring_system = {
        'scoring_system': [
            {'type': 'Additional Considerations', 'weight': 8,
             'evaluation': 'Experience with studio integrations should be weighted higher'},
            {'type': 'Additional Considerations', 'weight': 8,
             'evaluation': 'Data conversation/migration would be a great addition'}
        ]
    }
    # Use hardcoded total score calculation for test mode
    total_score = [
        {'type': 'Additional Considerations', 'weight': 8,
         'evaluation': 'Experience with studio integrations should be weighted higher',
         'candidate_score': 3,
         'reasoning': 'Limited information provided on studio integrations experience.',
         'id': str(uuid.uuid4())},
        {'type': 'Additional Considerations', 'weight': 8,
         'evaluation': 'Data conversation/migration would be a great addition',
         'candidate_score': 4,
         'reasoning': 'The resume does not provide any evidence of experience or skills in data conversation/migration.',
         'id': str(uuid.uuid4())}
    ]
    # Use hardcoded contact information for test mode
    contact_info = {
        'candidate_name': 'K R I S T I L A A R',
        'phone_number': '909.555.0100',
        'email': 'kristi@example.com'
    }
    return scoring_system, total_score, contact_info

def main(test_mode=True):
    candidate_rankings = []  # Array of objects storing candidate rankings
    directory = "/Users/reidrelatores/coding/dynamic-candidate-scoring/resumes"
    pdf_files = [f for f in os.listdir(directory) if f.endswith('.pdf')]  # List all PDF files

    # Process each PDF file with a progress bar
    for pdf_filename in tqdm(pdf_files, desc="Processing Resumes", unit="file"):
        pdf_path = os.path.join(directory, pdf_filename)
        resume = extract_text_from_pdf(pdf_path)

        if test_mode:
            # Hardcoded values for testing
            scoring_system, total_score, contact_info = simulate_test_mode()
        else:
            # Live mode processing
            scoring_system = get_scoring_system()
            total_score = []
            for criteria in scoring_system['scoring_system']:
                score = get_criteria_score(criteria, resume)
                criteria["candidate_score"] = score["candidate_score"]
                criteria["reasoning"] = score["reasoning"]
                criteria["id"] = str(uuid.uuid4())
                total_score.append(criteria)
            contact_info = get_contact_information(resume)

        final_score = calculate_final_score(total_score)
        candidate_rankings.append({
            "application_id": str(uuid.uuid4()),
            "final_score": final_score,
            "scoring": total_score,
            "contact_info": contact_info,
        })

    sorted_rankings = sorted(candidate_rankings, key=lambda x: x['final_score'], reverse=True)
    return sorted_rankings

if __name__ == "__main__":
    result = main(test_mode=False)
    print(json.dumps(result, indent=4, sort_keys=True))

    # Print a formatted leaderboard from the sorted rankings
    print("\nCandidate Leaderboard\n" + "-" * 30)
    leaderboard_format = "{rank:5} | {name:25} | {score:10} | {email:30}"
    print(leaderboard_format.format(rank="Rank", name="Candidate Name", score="Final Score", email="Email"))
    print("-" * 80)

    for i, candidate in enumerate(result, start=1):
        candidate_name = candidate['contact_info'].get('candidate_name', 'N/A')
        candidate_score = f"{round(candidate['final_score'])} / 100"  # Now formatted as a percentage
        candidate_email = candidate['contact_info'].get('email', 'N/A')
        print(
            leaderboard_format.format(rank=f"{i}.", name=candidate_name, score=candidate_score, email=candidate_email))

    print("-" * 80)
    print("End of Leaderboard")