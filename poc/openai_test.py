from utils import chat_completion_request, extract_text_from_pdf, calculate_final_score, read_file
from config import tools_resume, tools_scoring, model, agent_description, directory
import os
import uuid
import logging
import json
from tqdm import tqdm

# Set up logging to write to a file
logging.basicConfig(filename='process_logs.log', level=logging.INFO, filemode='w',
                    format='%(asctime)s - %(levelname)s - %(message)s')


def get_scoring_system():
    job_description = read_file("job_description.txt")
    custom_considerations = read_file("custom_considerations.txt")
    messages = [
        {
            "role": "system",
            "content": "You are a recruiter with 20 years of experience in analyzing resumes against job descriptions. Output JSON.",
        },
        {
            "role": "user",
            "content": f"Here is the job description for the job posting in question: {job_description}. "
                       f"Please generate a list of evaluations for scoring system to be used for this job description."
                       f"Make sure to include these additional considerations to the scoring system: {custom_considerations} "
                       f"There should be AT LEAST 7 separate evaluations to evaluate the job against but no more than 10."
                       f"Strictly adhere to a weight between 0 (unnecessary) & 10 (absolutely necessary)"
        }
    ]

    response = chat_completion_request(messages, model, tools=tools_scoring,
                                       tool_choice={"type": "function", "function": {"name": "get_scoring_system"}})

    if response:
        # Adding additional fields to the scoring system
        scoring_system = json.loads(response.choices[0].message.tool_calls[0].function.arguments)
        logging.info(f"Scoring system generated. {scoring_system}")

        for i, criterion in enumerate(scoring_system["scoring_system"]):
            criterion["id"] = f'ID_{criterion["type"][0].upper()}{i}'

        return scoring_system

    else:
        return None


def generate_evaluation_json(scoring_system):
    results = []

    for criteria in scoring_system['scoring_system']:
        evaluation_json = {
            'id': criteria['id'],
            'criteria_score': "[INSERT CANDIDATE SCORE HERE]",  # Placeholder score, replace with actual scoring logic
        }
        results.append(evaluation_json)

    return str(json.dumps(results, indent=4))


def get_criteria_score(scoring_data, resume):
    prompt = generate_evaluation_json(scoring_data)
    messages = [
        {
            "role": "system",
            "content": agent_description["all"] + "Output JSON."
        },
        {
            "role": "user",
            "content": f"Here is the candidate's resume: {resume}"
                       f"Here is a list of criteria to evaluate the resume: {scoring_data}"
                       f"For each criteria, provide a candidate score (0-10), "
                       f" and the ID associated with the evaulation."
                       f"Here is a template that you MUST use. "
                       f"You are REQUIRED to fill out sections in []. " + prompt
        }
    ]

    # response = chat_completion_request(messages, model)
    response = chat_completion_request(messages, model, tools=tools_scoring,
                                       tool_choice={"type": "function", "function": {"name": "get_candidate_score"}})
    if response:
        return json.loads(response.choices[0].message.tool_calls[0].function.arguments)
    else:
        return None


def parse_resume(resume):
    messages = [

        {
            "role": "system",
            "content": f"Your sole purpose is to parse resumes into 4 sections (Contact Information, Work Experience, "
                       f"Education, Skills / Certifications). You only copy & reorganize text. YOU DO NOT change text. Output JSON."

        },
        {
            "role": "user",
            "content": f"Here is the candidate's resume: {resume}."
                       f"Do not change text, just reorganize it into three sections: "
                       f"Contact Information, Education, Work Experience, and Skills / Certifications "
                       f"ALL 4 SECTIONS REQUIRED. Use N/A if you cannot determine a value."
        }
    ]

    response = chat_completion_request(messages, model, tools=tools_resume,
                                       tool_choice={"type": "function", "function": {"name": "parse_resume"}},
                                       response_format=None)
    if response:
        return json.loads(response.choices[0].message.tool_calls[0].function.arguments)
    else:
        return None


def simulate_test_mode():
    # Use hardcoded scoring system for test mode
    scoring_data = {
        "scoring_system": [
            {
                "evaluation": "8+ years of experience working in Workday",
                "id": "ID_W0",
                "type": "work_experience",
                "weight": 8
            },
            {
                "evaluation": "At least one full implementation of Workday, with demonstrated Workday technical and integrations experience",
                "id": "ID_W1",
                "type": "work_experience",
                "weight": 9
            },
            {
                "evaluation": "6+ years of experience building Workday Integrations with Workday Studio, EIB, and Core Connectors",
                "id": "ID_W2",
                "type": "work_experience",
                "weight": 8
            },
            {
                "evaluation": "6+ years experience developing Workday custom reports and calculated fields",
                "id": "ID_W3",
                "type": "work_experience",
                "weight": 7
            },
            {
                "evaluation": "6+ years' experience integrating systems with third-party service vendors",
                "id": "ID_W4",
                "type": "work_experience",
                "weight": 7
            },
            {
                "evaluation": "Bachelor's degree in Computer Science, Computer Engineering, relevant technical field, or equivalent practical experience",
                "id": "ID_E5",
                "type": "education",
                "weight": 6
            },
            {
                "evaluation": "Enthusiastic about solving complex, system-to-system integration problems",
                "id": "ID_S6",
                "type": "skills_certification",
                "weight": 9
            },
            {
                "evaluation": "Familiarity with Workday administrative functions including tenant configuration, data loads, payroll configurations and maintenance",
                "id": "ID_S7",
                "type": "skills_certification",
                "weight": 8
            },
            {
                "evaluation": "Proven record of accomplishment of effectively interacting with large sets of internal and external stakeholders",
                "id": "ID_S8",
                "type": "skills_certification",
                "weight": 7
            },
            {
                "evaluation": "Experience in Workday Extend based application implementation",
                "id": "ID_S9",
                "type": "skills_certification",
                "weight": 6
            }
        ]
    }
    # Use hardcoded total score calculation for test mode
    candidate_score = [
        {
            "criteria_score": 10,
            "id": "ID_W0",
            "reasoning": "The candidate has over 8 years of extensive experience working in various roles related to Workday, showcasing exceptional expertise."
        },
        {
            "criteria_score": 9,
            "id": "ID_W1",
            "reasoning": "The candidate has demonstrated experience leading and implementing a concept for verifiable credentials, securing substantial funding and acting as a technical subject matter expert in integrating credential data into enterprise platforms, notably Workday."
        },
        {
            "criteria_score": 9,
            "id": "ID_W2",
            "reasoning": "With over 6 years of experience building Workday integrations using various tools and technologies, the candidate has demonstrated significant proficiency and expertise in this area."
        },
        {
            "criteria_score": 7,
            "id": "ID_W3",
            "reasoning": "The candidate has 6+ years of experience in developing Workday custom reports and calculated fields, showing a solid foundation in report development within the Workday platform."
        },
        {
            "criteria_score": 7,
            "id": "ID_W4",
            "reasoning": "Having over 6 years of experience integrating systems with third-party service vendors, the candidate has a strong background in system integration and collaboration with external partners."
        },
        {
            "criteria_score": 5,
            "id": "ID_E5",
            "reasoning": "The candidate has a Bachelor's degree in Mechanical Engineering, which is a relevant technical field."
        },
        {
            "criteria_score": 9,
            "id": "ID_S6",
            "reasoning": "Extensive certification in Workday Studio and integration technologies aligns with the high competency required for complex system-to-system integration problems"
        },
        {
            "criteria_score": 8,
            "id": "ID_S7",
            "reasoning": "Extensive expertise in Workday administrative functions and configurations meets the advanced level of familiarity expected for tenant configuration and data management"
        },
        {
            "criteria_score": 6,
            "id": "ID_S9",
            "reasoning": "Solid experience in Workday Extend indicates a good foundation for application implementation although may require further development"
        },
        {
            "criteria_score": 0,
            "id": "ID_S8",
            "reasoning": "Insufficient evidence of interacting effectively with large sets of stakeholders based on the provided qualifications"
        }
    ]
    # Use hardcoded contact information for test mode
    format_resume = {
        "contact_information": {
            "email": "rrrelatores@gmail.com",
            "name": "Reid Relatores",
            "phone_number": "513.675.8640"
        },
        "education": "Ohio State University \u2013B.S. Mechanical Engineering Aug 2011 \u2013Dec 2016",
        "skills_certification": "\u2022Certifications in Workday Studio, Integrations, HCM, Recruiting, and Talent & Performance.\n\u2022Expert in Workday integration technologies including WD Studio, RaaS , EIB, Core Connectors, PECI, Advanced Load, OX 2.0)\n\u2022Expert in working with Workday business processes, calculated fields, custom reports, and general configuration.\n\u2022Expert with Workday APIs (WWS, Public REST, & WQL)\n\u2022Experience with Workday Extend .\n\u2022Proficient in Python, JavaScript, React, REST & SOAP API, HTML, CSS, XML, JSON",
        "work_experience": "Accenture \u2013Integrations Lead, Insurance Company Nov 2023 -Present\n\u2022Supporting the deployment of a web application that overlays & integrates with Workday to enrich the overall hiring, talent, & onboarding experiences for candidates, employees, and managers.\n\u2022Leveraging Workday WWS, RaaS , and WQL to develop real -time, high -performance API services tailored for the web application.\n\u2022Implementing GenAI solutions that leverage Workday data to create seamless experiences around feedback, hiring, and leave -management.\n\nAccenture \u2013Digital Identity & Integrations Specialist Dec 2022 -Oct 2023\n\u2022Developed an interoperable middleware integration platform concept for verifiable credentials, securing over $1M in funding for FY24.\n\u2022Acted as the technical SME for integrating credential data into enterprise platforms, notably Workday.\n\nAccenture \u2013Integrations & Reporting Lead, Life Sciences Company Nov 2021 -Oct 2023\n\u2022Designed, developed, built, tested, and deployed over 30+ Workday integrations spanning Recruiting, HCM, and Talent modules.\n\u2022Led the reporting work stream to design, build, and test over 20 Workday reports, including 10 Matrix reports .\n\u2022Facilitated design workshops with functional, data, and integration resources to properly document and design integrations and reports.\n\nAccenture \u2013Integrations Specialist, Entertainment Company Dec 2019 \u2013Nov 2021\n\u2022Co-led the integrations team to design, develop, build, test, and deploy over 100+ Workday integrations spanning multiple Workday modules.\n\u2022Led a team to analyze, document, and disposition over 400+ existing Workday integrations in an acquired company\u2019s existing tenant.\n\nAccenture \u2013Data Migration Lead, Entertainment Company Jul 2019 \u2013Dec 2019\n\u2022Partnered with security teams to document data protection strategy that followed client's security guidelines.\n\u2022Led a team to execute the foundation migration in order to test data pipelines and overall process flows.\n\nAccenture \u2013Data Migration Specialist, Aerospace Company Jan 2017 \u2013Jul 2019\n\u2022Managed the recruiting data migration into Workday for a major aerospace company. In addition, led the full suite (i.e . HCM, Recruiting, Compensation, Performance) migration effort for their four subsidiary companies ."
    }
    return scoring_data, candidate_score, format_resume


def filter_by_type(scoring_data, desired_type):
    """
    Filters a list of scoring criteria by the specified type.

    :param scoring_data: List of dictionaries containing scoring criteria.
    :param desired_type: The type to filter by.
    :return: List of dictionaries where the 'type' matches the desired type.
    """
    filtered_data = [item for item in scoring_data['scoring_system'] if item['type'] == desired_type]
    return filtered_data


def merge_score(candidate_score, scoring_data):
    # Create a dictionary for scoring data for quick lookup
    scoring_dict = {item['id']: item for item in scoring_data['scoring_system']}

    # Merge candidate scores with scoring data
    merged_data = []
    for candidate in candidate_score['candidate_scores']:
        if candidate['id'] in scoring_dict:
            merged_item = {**candidate, **scoring_dict[candidate['id']]}
            merged_data.append(merged_item)

    return merged_data


def main(resume_directory=directory, test_mode=True):
    candidate_rankings = []  # Array of objects storing candidate rankings
    pdf_files = [f for f in os.listdir(resume_directory) if f.endswith('.pdf')]  # List all PDF files

    # Generate scoring system
    scoring_data = get_scoring_system()
    logging.info(f"Scoring system generated. {scoring_data}")

    # Process each PDF file with a progress bar
    logging.info("Starting processing of resumes.")
    for pdf_filename in tqdm(pdf_files, desc="Processing Resumes", unit="file"):
        pdf_path = os.path.join(directory, pdf_filename)
        resume = extract_text_from_pdf(pdf_path)
        logging.info(f"Extracted text from {pdf_filename}")

        if test_mode:
            # Hardcoded values for testing
            x, score, format_resume = simulate_test_mode()
            logging.info(f"Test Mode: {pdf_filename} scored with {candidate_score}")

        else:
            # Get candidate_score
            score = get_criteria_score(scoring_data, resume)
            logging.info(f"Candidate scores for {pdf_filename}: {score}")

        # Merge scoring system with scores
        all_scores = merge_score(score, scoring_data)
        # Calculate final score
        final_score = calculate_final_score(all_scores)
        logging.info(f"Final score for {pdf_filename}: {final_score}")

        candidate_rankings.append({
            "application_id": str(uuid.uuid4()),
            "all_scores": all_scores,
            "final_score": final_score,
            "resume": pdf_filename,
        })

    sorted_rankings = sorted(candidate_rankings, key=lambda x: x['final_score'], reverse=True)
    logging.info("Completed processing all resumes.")
    return sorted_rankings


if __name__ == "__main__":
    candidate_rankings = main(test_mode=False)
    # print(json.dumps(candidate_rankings, indent=4))

    # Print a formatted leaderboard from the sorted rankings
    print("\nCandidate Leaderboard\n" + "-" * 30)
    leaderboard_format = "{rank:5} | {resume:25} | {score:10}"
    print(leaderboard_format.format(rank="Rank", resume="Resume", score="Final Score"))
    print("-" * 80)

    for i, application in enumerate(candidate_rankings, start=1):
        resume = application['resume']
        candidate_score = f"{round(application['final_score'])} / 100"  # Now formatted as a percentage
        print(
            leaderboard_format.format(rank=f"{i}.", resume=resume, score=candidate_score))

    print("-" * 80)
    print("End of Leaderboard")
