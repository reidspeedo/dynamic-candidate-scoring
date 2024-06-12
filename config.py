# model
model = "gpt-3.5-turbo-0125"
# model = "gpt-4o"

# Configuration for tools used in the API
tools = [
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
                             "enum": ["Work History", "Education", "Skills & Certifications",
                                      "Additional Considerations"],
                             "description": "The category should be one of the following: Work History, Education, Skills & Certifications, or Custom Considerations"
                         },
                         "weight": {
                             "type": "number",
                             "description": "The weight assigned to this category, between 0 and 10."},
                         "evaluation": {
                             "type": "string",
                             "description": "The evaluation criteria (i.e, 10 years of Python experience)"
                         }
                     }
                 }
             },
             "required": ["type", "weight", "evaluation"]
         }
     }
     },
    {"type": "function",
     "function": {
         "name": "get_candidate_score",
         "description": "Evaluates a candidate's resume against the an evaluation for the job, based on various "
                        "criteria such as Work History, Education, Skills & Certifications, or Additional "
                        "Considerations.",
         "parameters": {
             "type": "object",
             "properties": {
                 "candidate_score": {
                     "type": "number",
                     "description": "The score (0-10) awarded for this criteria."
                 },
                 "reasoning": {
                     "type": "string",
                     "description": "The rationale behind the score assigned."
                 }
             }
         },
         "required": ["candidate_score", "reasoning"]
     }},
    {"type": "function",
     "function": {
         "name": "get_contact_details",
         "description": "Retrieves phone number, email, and name details for a candidate from their resume. ",
         "parameters": {
             "type": "object",
             "properties": {
                 "candidate_name": {
                     "type": "string",
                     "description": "First and last name of the candidate."
                 },
                 "phone_number": {
                     "type": "string",
                     "description": "Phone number of the candidate."
                 },
                 "email": {
                     "type": "string",
                     "description": "Email number of the candidate."
                 }

             }
         },
         "required": ["candidate_name", "phone_number", "email"]
     }}
]
