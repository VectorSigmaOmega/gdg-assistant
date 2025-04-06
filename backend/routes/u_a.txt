from flask import Blueprint, request, jsonify
from firebase_config import db, bucket
import os
from grading import run_grading

upload_bp = Blueprint("upload", __name__, url_prefix="/api")

@upload_bp.route("/upload-assignment", methods=["POST"])
def upload_assignment():
    try:
        student_id = request.form["student_id"]
        assignment_id = request.form["assignment_id"]
        file = request.files.get("file")
        if not file:
            return jsonify({"error": "No file uploaded"}), 400

        # Upload student assignment to Firebase Storage
        file_ext = os.path.splitext(file.filename)[-1]
        blob_path = f"assignments_submitted/{student_id}/{assignment_id}/assignment{file_ext}"
        blob = bucket.blob(blob_path)
        blob.upload_from_file(file)
        blob.make_public()
        assignment_url = blob.public_url

        # Get teacher's uploaded questions/textbook URLs
        assignment_doc = db.collection("assignments").document(assignment_id).get()
        if not assignment_doc.exists:
            return jsonify({"error": "Invalid assignment ID"}), 400

        assignment_data = assignment_doc.to_dict()
        questions_url = assignment_data.get("questions_pdf")
        textbook_url = assignment_data.get("textbook_pdf")

        if not isinstance(questions_url, str):
            return jsonify({"error": "Invalid questions_pdf URL in Firestore"}), 500

        print(f"[DEBUG] assignment_pdf: {assignment_url}")
        print(f"[DEBUG] questions_pdf: {questions_url}")
        print(f"[DEBUG] textbook_pdf: {textbook_url}")


        # Run grading — downloads URLs internally
        grading_result = run_grading(
            assignment_path=assignment_url,
            questions_path=questions_url,
            textbook_path=textbook_url
        )
        print("===========i========")

        # Save result to Firestore
        grade_id = f"{student_id}_{assignment_id}"
        db.collection("grades").document(grade_id).set({
            "student_id": student_id,
            "assignment_id": assignment_id,
            "assignment_pdf": assignment_url,
            "questions_pdf": questions_url,
            "textbook_pdf": textbook_url,
            "grading": [g.dict() for g in grading_result]
        })

        return jsonify({
            "message": "Assignment uploaded and graded",
            "grading": [g.dict() for g in grading_result]
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500



#grades.py

from flask import Blueprint, jsonify
from firebase_config import db

grades_bp = Blueprint("grades", __name__, url_prefix="/api/grades")

@grades_bp.route("/<student_id>", methods=["GET"])
def get_student_grades(student_id):
    try:
        grades_ref = db.collection("grades")
        query = grades_ref.where("student_id", "==", student_id)
        docs = query.stream()

        grades = []
        for doc in docs:
            data = doc.to_dict()
            grades.append({
                "assignment_id": data.get("assignment_id"),
                "grading": data.get("grading", []),
                "assignment_pdf": data.get("assignment_pdf")
            })

        return jsonify(grades)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@grades_bp.route("/<student_id>/<assignment_id>", methods=["GET"])
def get_assignment_grading(student_id, assignment_id):
    try:
        doc_id = f"{student_id}_{assignment_id}"
        doc = db.collection("grades").document(doc_id).get()

        if doc.exists:
            data = doc.to_dict()
            return jsonify({
                "assignment_id": data.get("assignment_id"),
                "assignment_pdf": data.get("assignment_pdf"),
                "questions_pdf": data.get("questions_pdf"),
                "textbook_pdf": data.get("textbook_pdf"),
                "grading": data.get("grading", [])
            })
        else:
            return jsonify({"error": "Grade record not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500
