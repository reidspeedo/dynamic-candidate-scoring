# GPT Model
model = "gpt-3.5-turbo-0125"
# model = "gpt-4"
# Resume directory
directory = "/Users/reidrelatores/coding/dynamic-candidate-scoring/resumes"
# Configuration for tools used in the API
tools = [
    {"type": "function",
     "function": {
         "name": "parse_resume",
         "description": "Retrieves contact information, Work Experience, Education, and Skills & Certifications from "
                        "a candidates resume",
         "parameters": {
             "type": "object",
             "properties": {
                 "work_experience": {
                     "type": "string",
                     "description": "All Work Experience from the resume."
                 },
                 "education": {
                     "type": "string",
                     "description": "Education from the resume."
                 },
                 "skills_certification": {
                     "type": "string",
                     "description": "All Skills & Certifications from the resume."
                 },
                 "contact_information": {
                     "type": "object",
                     "description": "Name, email, and phone number from the resume.",
                     "properties": {
                         "name": {
                             "type": "string",
                             "description": "First and last name of the candidate"
                         },
                         "email": {
                             "type": "string",
                             "description": "email of the candidate"
                         },
                         "phone_number": {
                             "type": "string",
                             "description": "phone_number of the candidate"
                         }
                     }
                 }

             }
         },
         "required": ["contact_information", "work_experience", "education", "skills_certification"]
     }},
    {"type": "function",
     "function": {
         "name": "get_scoring_system",
         "description": "Generate a candidate scoring system based on a job description and additional considerations.",
         "parameters": {
             "type": "object",
             "properties": {
                 "scoring_system": {
                     "type": "object",
                     "description": "A list of criteria (based on the job description and additional considerations) for the scoring system to use",
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
                     }
                 }
             },
             "required": ["type", "weight", "evaluation"]
         }
     }},
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
                                "reasoning": {
                                    "type": "string",
                                    "description": "The rationale behind the score assigned."
                                },
                                "id": {
                                    "type": "string",
                                    "description": "The ID assigned to the input evaluation."
                                }
                            },
                            "required": ["criteria_score", "reasoning", "weight", "id"]
                        }
                    }
                },
                "required": ["candidate_scores"]
            }
        }
    }
]
# Descriptions for GPT agents
agent_description = {
    "education": """
        You are a recruiter with 20 years of experience in analyzing resumes against job descriptions.
        You specialize in candidate scoring/ranking for Education
        You are experienced, concise, unbiased, and qualitative with your analysis.
        Here is the scoring system you use:
        0: No formal education or training relevant to the field.
        1-2: High school diploma or equivalent, no further relevant education.
        3-4: Relevant associate’s degree or some college coursework without completion.
        5-6: Bachelor’s degree in a relevant field.
        7-8: Master’s degree in a relevant field or bachelor’s degree with additional certifications.
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
        3. Skills & Certifications
        0: No demonstrable skills or experience related to the job requirements.
        1-2: Basic understanding of required skills; requires substantial training.
        3-4: Fair competency in skills relevant to the job; can perform tasks with supervision.
        5-6: Good skill set; can perform all standard job tasks independently.
        7-8: Strong skills with additional specialized abilities beyond basic requirements; can lead projects or train others.
        9: Highly advanced skill set with expertise in multiple relevant areas; recognized as an expert by peers.
        10: Top-tier professional with exceptional skills and pioneering experience in the field; thought leader or innovator.
    """,
}
