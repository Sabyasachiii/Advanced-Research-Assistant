import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

key = os.getenv("GEMINI_API_KEY")
print("Key loaded:", key[:10] + "...")

genai.configure(api_key=key)

model = genai.GenerativeModel("gemini-3.5-flash")

try:
    response = model.generate_content("Say hello in one sentence.")
    print(response.text)
except Exception as e:
    print("ERROR:")
    print(type(e).__name__)
    print(e)