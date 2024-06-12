from openai import OpenAI
from pdfminer.high_level import extract_text
import os

# Initialize API client
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)


def chat_completion_request(messages, model, tools=None, tool_choice=None):
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
            messages=messages,
            tools=tools,
            tool_choice=tool_choice,
            # temperature=.2
        )
        return response
    except Exception as e:
        print("Unable to generate ChatCompletion response")
        print(f"Exception: {e}")
        return None


def calculate_final_score(candidate_data):
    total_score = 0
    total_weight = 0
    max_possible_score = 0

    # Iterate through each score in the candidate_score list
    for score_info in candidate_data:
        # Calculate the weighted score for each criterion
        weighted_score = score_info['candidate_score'] * score_info['weight']
        total_score += weighted_score
        total_weight += score_info['weight']
        max_possible_score += score_info['weight'] * 10  # Assuming the maximum score for any criterion is 10

    # Compute final score by dividing the total weighted score by the total weight
    if total_weight != 0:
        normalized_final_score = total_score / max_possible_score * 100  # Normalize to a percentage
    else:
        normalized_final_score = 0  # Avoid division by zero

    return normalized_final_score


def extract_text_from_pdf(pdf_path):
    """
    Extracts text from a PDF file.
    Args:
        pdf_path (str): Path to the PDF file.
    Returns:
        str: Extracted text or None if an exception occurs.
    """
    try:
        text = extract_text(pdf_path)
        return text
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return None