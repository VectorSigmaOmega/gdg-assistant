from flask import Blueprint, request, jsonify
from firebase_config import db, bucket
import os, tempfile, time
from grading import run_grading

upload_bp = Blueprint("upload", __name__, url_prefix="/api")

@upload_bp.route("/upload-assignment", methods=["POST"])
def upload_assignment():
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
        return jsonify({"error": "Invalid or missing questions_pdf URL"}), 500

    print(f"[DEBUG] assignment_pdf URL: {assignment_url}")
    print(f"[DEBUG] questions_pdf URL: {questions_url}")
    print(f"[DEBUG] textbook_pdf URL: {textbook_url}")

    # Helper: download Firebase Storage URL to temp local file
    def download_pdf_from_url(url):
    # Get the path after the bucket name in the public URL
    # Example: https://storage.googleapis.com/gradegenius-22928.appspot.com/path/to/file.pdf
        prefix = f"https://storage.googleapis.com/{bucket.name}/"
        if not url.startswith(prefix):
            raise ValueError("URL does not match expected Firebase Storage public URL format")
        blob_name = url[len(prefix):]  # remove prefix to get blob path

        blob = bucket.blob(blob_name)
        # Create a temp file and close its fd immediately to avoid Windows file locking
        fd, temp_path = tempfile.mkstemp(suffix=".pdf")
        os.close(fd)
        with open(temp_path, "wb") as f:
            blob.download_to_file(f)
        return temp_path

    # Helper: best-effort remove to handle transient Windows file locks
    def remove_quiet(path: str):
        if not path:
            return
        for attempt in range(3):
            try:
                os.remove(path)
                return
            except PermissionError:
                # Brief backoff; another handle may still be closing
                time.sleep(0.1)
            except FileNotFoundError:
                return


    # Download all PDFs locally
    assignment_pdf_path = download_pdf_from_url(assignment_url)
    questions_pdf_path = download_pdf_from_url(questions_url)
    textbook_pdf_path = download_pdf_from_url(textbook_url) if textbook_url else None

    try:
        # Run grading — pass local file paths
        grading_result = run_grading(
            assignment_path=assignment_pdf_path,
            questions_path=questions_pdf_path,
            textbook_path=textbook_pdf_path
        )

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
    finally:
        # Clean up local temp files (best effort)
        remove_quiet(assignment_pdf_path)
        remove_quiet(questions_pdf_path)
        if textbook_pdf_path:
            remove_quiet(textbook_pdf_path)

