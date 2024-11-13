from openai import AsyncOpenAI
import logging
from typing import List, Dict, Any
from core.config import get_settings

settings = get_settings()

client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

async def chat_completion_request(
    messages: List[Dict[str, str]],
    model: str,
    tools: List[Dict[str, Any]] = None,
    tool_choice: Dict[str, Any] = None,
    response_format: Dict[str, Any] = {"type": "json_object"},
    seed: int = None
) -> Any:
    """Make a chat completion request to OpenAI."""
    try:
        response = await client.chat.completions.create(
            model=model,
            response_format=response_format,
            messages=messages,
            seed=seed,
            tools=tools,
            tool_choice=tool_choice,
            temperature=0
        )
        return response
    except Exception as e:
        logging.error(f"OpenAI API request failed: {str(e)}")
        return None

