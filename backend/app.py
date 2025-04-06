from flask import Flask
from routes.assignment import assignment_bp
from routes.grades import grades_bp
from routes.upload_assignment import upload_bp
from routes.teacher import teacher_bp
from firebase_config import db, bucket




app = Flask(__name__)

# Register all Blueprints
app.register_blueprint(teacher_bp)
app.register_blueprint(assignment_bp)
app.register_blueprint(grades_bp, url_prefix="/api/grades")
app.register_blueprint(upload_bp)

if __name__ == "__main__":
    print("Registered routes:")
    for rule in app.url_map.iter_rules():
        print(rule)
    app.run(debug=True)
