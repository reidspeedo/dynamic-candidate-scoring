import requests
from pathlib import Path
import json

def test_scoring_endpoint():
    url = "http://localhost:8000/api/v1/score"
    
    # Define the scoring system
    scoring_system = {
        "criteria": [
            {
                "type": "work_experience",
                "description": "5+ years of Python development experience",
                "weight": 8
            },
            {
                "type": "education",
                "description": "Bachelor's degree in Computer Science or related field",
                "weight": 6
            },
            {
                "type": "skills_certification",
                "description": "Strong experience with FastAPI and REST APIs",
                "weight": 7
            }
        ]
    }
    
    # Get all resumes from the test/resume folder
    resume_folder = Path(__file__).parent / "resumes"
    
    try:
        # Open files and create the multipart form-data
        with requests.Session() as session:
            files = []
            opened_files = []  # Keep track of opened files
            
            # Open and store file handles
            for resume_file in resume_folder.glob("*.pdf"):
                file_handle = open(resume_file, "rb")
                opened_files.append(file_handle)
                files.append(
                    ("resumes", (resume_file.name, file_handle, "application/pdf"))
                )

            # Make the request
            response = session.post(
                url,
                files=files,
                data={"scoring_system": json.dumps(scoring_system)}
            )
            
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.json()}")
            
    except Exception as e:
        print(f"Error: {str(e)}")
    
    finally:
        # Clean up: close all opened files
        for file_handle in opened_files:
            file_handle.close()

if __name__ == "__main__":
    test_scoring_endpoint()