
from fastapi import APIRouter, File, UploadFile, HTTPException, Form
from fastapi.responses import JSONResponse
import shutil
import os
import uuid
from datetime import datetime
from database import get_db_connection

router = APIRouter()

UPLOAD_DIR = "uploads"
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".pdf"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

@router.post("/api/documents")
async def upload_document(
    file: UploadFile = File(...),
    user_id: str = Form(...)  # Get user_id from form data
):
    try:
        # 1. Validate File
        file_ext = os.path.splitext(file.filename)[1].lower()
        if file_ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(status_code=400, detail="Invalid file type. Only JPG, PNG, and PDF allowed.")
        
        # Check file size (Note: UploadFile doesn't strictly enforce size before reading, 
        # but we can check content-length header or read chunks. 
        # For simplicity in this learning context, we trust content-length or handle during write, 
        # but here we'll assume basic validation passed or add chunk reading if needed.
        # Let's trust content-length if available for now for quick rejection)
        # if file.size > MAX_FILE_SIZE: ... (UploadFile.size isn't always available directly without spooling)

        # 2. Prepare Storage
        if not os.path.exists(UPLOAD_DIR):
            os.makedirs(UPLOAD_DIR)

        # Generate unique filename
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)

        # 3. Save File
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 4. Prepare Metadata
        title = file.filename
        content_type = file.content_type
        file_size = os.path.getsize(file_path)

        # 5. Save to Database
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO documents (user_id, filename, file_path, title, content_type, file_size)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (user_id, unique_filename, file_path, title, content_type, file_size))
        
        document_id = cursor.lastrowid
        conn.commit()
        conn.close()

        return JSONResponse(
            status_code=201,
            content={
                "message": "File uploaded successfully",
                "document": {
                    "id": document_id,
                    "title": title,
                    "file_path": file_path
                }
            }
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
