from google import genai
from google.genai import types
from pydantic import BaseModel
from typing import Optional, List
import os
import json
from dotenv import load_dotenv

load_dotenv()
GENAI_API_KEY = os.getenv("GENAI_API_KEY")
client = genai.Client(api_key=GENAI_API_KEY)

class Evaluate(BaseModel):
    q_no: int
    score: float
    feedback: str
    concept: Optional[str] = None

# Grading function
def grade_with_llm(assignment_path: str, questions_path: str, textbook_path: Optional[str] = None) -> List[Evaluate]:
    assignment_pdf = client.files.upload(file=assignment_path)
    questions_pdf = client.files.upload(file=questions_path)

    contents = [
        """
        You will receive 2 or 3 files:
        - One PDF with assignment questions and course objectives (questions_pdf)
        - One PDF with a student's responses (assignment_pdf) for corresponding questions in questions_pdf
        - Optionally, a textbook PDF for extra domain-specific context

        For each attempted question, return:
        - q_no: Question number
        - score: A float score out of 100 based primarily on how well the question is answered, and secondarily on how well it aligns with the course objective
        - feedback: Clear, actionable guidance. Explain what was done well or wrong.
        - concept: The main concept or skill being tested

        Respond strictly in JSON as a list of evaluations.
        """,
        questions_pdf,
        assignment_pdf,
    ]

    if textbook_path:
        textbook_pdf = client.files.upload(file=textbook_path)
        contents.append(textbook_pdf)

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=contents,
        config={
            'response_mime_type': 'application/json',
            'response_schema': list[Evaluate],
        },
    )

    print(response.text)

    results: list[Evaluate] = response.parsed

    return results

if __name__ == "__main__":
    uploads_folder = "uploads"
    assignment_path = os.path.join(uploads_folder, "sample-student-assignment.pdf")
    questions_path = os.path.join(uploads_folder, "sample-teacher-questions.pdf")
    textbook_path = os.path.join(uploads_folder, "Lecture3.pdf")

    # Run grading
    try:
        results = grade_with_llm(assignment_path, questions_path, textbook_path)
        print("\n✅ Grading complete:\n")
        for res in results:
            print(res.model_dump())

    except Exception as e:
        print(f"\n❌ Error: {e}")
