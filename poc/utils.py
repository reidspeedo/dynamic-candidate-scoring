from openai import OpenAI
from pdfminer.high_level import extract_text
import os
from PyPDF2 import PdfReader
import re  # Regular expression module

# Initialize API client
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)


def chat_completion_request(messages, model, tools=None, tool_choice=None, response_format={"type": "json_object"}):
    """
    Sends a request to the OpenAI API to generate a chat completion.
    Args:
        messages (list): List of message dictionaries.
        model (str): Model to be used for the completion.
        tools (list, optional): Tools configuration.
        tool_choice (dict, optional): Tool choice configuration.
    Returns:
        Response object or Exception message.
    """
    try:
        response = client.chat.completions.create(
            model=model,
            response_format=response_format,
            messages=messages,
            tools=tools,
            tool_choice=tool_choice,
            temperature=0
        )
        return response
    except Exception as e:
        print("Unable to generate ChatCompletion response")
        print(f"Exception: {e}")
        return None


def calculate_final_score(all_scores):
    total_score = 0
    total_weight = 0
    max_possible_score = 0

    # Iterate through each score in the candidate_score list
    for score_info in all_scores:
        # Calculate the weighted score for each criterion
        weighted_score = score_info['criteria_score'] * score_info['weight']
        total_score += weighted_score
        total_weight += score_info['weight']
        max_possible_score += score_info['weight'] * 10  # Assuming the maximum score for any criterion is 10

    # Compute final score by dividing the total weighted score by the total weight
    if total_weight != 0:
        normalized_final_score = total_score / max_possible_score * 100  # Normalize to a percentage
    else:
        normalized_final_score = 0  # Avoid division by zero

    return normalized_final_score


def read_file(file_path):
    with open(file_path, "r") as file:
        return file.read().strip()


def extract_text_from_pdf(pdf_path):
    text = ""
    try:
        reader = PdfReader(pdf_path)
        for page in reader.pages:
            text += page.extract_text() + ' '  # Add a space after each page's text to separate pages
    except Exception as e:
        print(f"Failed to extract text from {pdf_path}: {e}")

    # Clean up the text
    # Replace multiple spaces with a single space
    text = re.sub(r'\s+', ' ', text)

    # Optional: Remove spaces at the beginning and end of the text
    text = text.strip()

    return text
