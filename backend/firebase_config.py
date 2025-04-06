import firebase_admin
from firebase_admin import credentials, firestore, storage

cred = credentials.Certificate("serviceAccountKey.json")

# Only initialize if not already initialized
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred, {
        "storageBucket": "gradegenius-22928.firebasestorage.app"  # ← correct format
    })

db = firestore.client()
bucket = storage.bucket()
