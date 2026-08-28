import os
from pathlib import Path

from dotenv import load_dotenv
import google.generativeai as genai

# Load .env
BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")

API_KEY = os.getenv("GEMINI_API_KEY")


genai.configure(api_key=API_KEY)

model = genai.GenerativeModel("gemini-3.5-flash")


def generate_answer(
    question: str,
    context: str,
    conversation: str
):
    """
    Generate an answer using Gemini with conversation history.
    """

    prompt = f"""
You are an AI Research Assistant.

Continue the conversation naturally.

Use ONLY the information provided in the context.

If the answer is not found in the context, reply exactly:

"I couldn't find the answer in the uploaded documents."

-----------------------------
Conversation History
-----------------------------
{conversation}

-----------------------------
Document Context
-----------------------------
{context}

-----------------------------
Current Question
-----------------------------
{question}

Answer:
"""

    try:
        response = model.generate_content(prompt)

        if response.text:
            return response.text.strip()

        return "No response generated."

    except Exception as e:
        return f"Gemini Error: {e}"