from flask import Blueprint, request, jsonify
from firebase_config import db, bucket
import uuid
import os

teacher_bp = Blueprint("teacher", __name__, url_prefix="/api/teacher")

@teacher_bp.route("/create-assignment", methods=["POST"])
def create_assignment():
    try:
        title = request.form["title"]
        due_date = request.form["due_date"]
        course_id = request.form["course_id"]
        questions_file = request.files.get("questions_pdf")
        textbook_file = request.files.get("textbook_pdf")
 
        if not questions_file or not textbook_file:
            return jsonify({"error": "Both questions and textbook PDFs are required"}), 400

        # Create unique assignment ID
        assignment_id = str(uuid.uuid4())
        
        # Upload questions PDF
        q_ext = os.path.splitext(questions_file.filename)[-1]
        q_blob_path = f"{assignment_id}/questions/{uuid.uuid4()}_{questions_file.filename}"
        q_blob = bucket.blob(q_blob_path)
        q_blob.upload_from_file(questions_file)
        q_blob.make_public()
        questions_url = q_blob.public_url


        # Upload textbook PDF
        t_ext = os.path.splitext(textbook_file.filename)[-1]
        t_blob_path = f"{assignment_id}/textbook/{uuid.uuid4()}_{textbook_file.filename}"
        t_blob = bucket.blob(t_blob_path)
        t_blob.upload_from_file(textbook_file)
        t_blob.make_public()
        textbook_url = t_blob.public_url

        # Save metadata to Firestore
        db.collection("assignments").document(assignment_id).set({
            "assignment_id": assignment_id,
            "title": title,
            "due_date": due_date,
            "course_id": course_id,
            "questions_pdf": questions_url,
            "textbook_pdf": textbook_url
        })

        return jsonify({"message": "Assignment created successfully", "assignment_id": assignment_id})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
