from flask import Blueprint, jsonify
from firebase_config import db

assignment_bp = Blueprint("assignments", __name__, url_prefix="/api/assignments")

@assignment_bp.route("/", methods=["GET"])
def get_assignments():
    try:
        assignments_ref = db.collection("assignments")
        docs = assignments_ref.stream()

        assignments = []
        for doc in docs:
            data = doc.to_dict()
            assignments.append({
                "assignment_id": data.get("assignment_id"),
                "title": data.get("title"),
                "due_date": data.get("due_date"),
                "questions_pdf": data.get("questions_pdf"),
                "textbook_pdf": data.get("textbook_pdf"),
                "course_id": data.get("course_id")
            })

        return jsonify(assignments)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
