
from fastapi import APIRouter, File, UploadFile, HTTPException, Form, BackgroundTasks
from fastapi.responses import JSONResponse
import shutil
import os
import uuid
from datetime import datetime
from database import get_db_connection
from services.llm_service import process_document

router = APIRouter()

UPLOAD_DIR = "uploads"
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".pdf"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

@router.post("/api/documents")
async def upload_document(
    background_tasks: BackgroundTasks,
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

        # 6. Trigger Background Processing
        background_tasks.add_task(process_document, document_id, file_path)

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

@router.get("/api/documents")
async def get_documents(user_id: str):
    """
    Retrieve all documents for a specific user.
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, title, upload_date, content_type, file_path, extracted_text, processing_status 
            FROM documents 
            WHERE user_id = ? 
            ORDER BY upload_date DESC
        ''', (user_id,))
        
        documents = []
        rows = cursor.fetchall()
        
        for row in rows:
            # Create a preview of the text (first 150 chars)
            preview_text = ""
            if row['extracted_text']:
                preview_text = row['extracted_text'][:150] + "..." if len(row['extracted_text']) > 150 else row['extracted_text']
            elif row['processing_status'] == 'processing':
                preview_text = "Processing document..."
            elif row['processing_status'] == 'failed':
                preview_text = "Processing failed."
            else:
                preview_text = "No text extracted."

            documents.append({
                "id": row['id'],
                "title": row['title'],
                "category": "Uncategorized", # Default for now
                "date": row['upload_date'], # You might want to format this
                "preview": preview_text,
                "status": row['processing_status'],
                "file_path": row['file_path'] # Optional, depending on if frontend needs it direct
            })
            
        conn.close()
        
        return {
            "success": True,
            "count": len(documents),
            "documents": documents
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/documents/{document_id}")
async def get_document_details(document_id: int, user_id: str):
    """
    Retrieve details for a single document.
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, title, upload_date, content_type, file_path, extracted_text, processing_status, file_size
            FROM documents 
            WHERE id = ? AND user_id = ?
        ''', (document_id, user_id))
        
        row = cursor.fetchone()
        conn.close()
        
        if not row:
            raise HTTPException(status_code=404, detail="Document not found")
            
        return {
            "success": True,
            "document": {
                "id": row['id'],
                "title": row['title'],
                "category": "Uncategorized", # Default
                "date": row['upload_date'],
                "content_type": row['content_type'],
                "file_size": row['file_size'],
                "status": row['processing_status'],
                "extracted_text": row['extracted_text'],
                "file_path": row['file_path']
            }
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from fastapi.responses import FileResponse

@router.get("/api/documents/file/{document_id}")
async def get_document_file(document_id: int, user_id: str):
    """
    Serve the original file for a document.
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT file_path, content_type FROM documents WHERE id = ? AND user_id = ?', (document_id, user_id))
        row = cursor.fetchone()
        conn.close()
        
        if not row:
            raise HTTPException(status_code=404, detail="Document not found")
            
        file_path = row['file_path']
        content_type = row['content_type']
        
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="File not found on server")
            
        return FileResponse(
            file_path, 
            media_type=content_type, 
            filename=os.path.basename(file_path),
            content_disposition_type='inline'
        )

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def _delete_document_helper(document_id: int, user_id: str):
    """
    Helper function to delete a document record and its associated file.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # 1. Get file path before deleting record
        cursor.execute('SELECT file_path FROM documents WHERE id = ? AND user_id = ?', (document_id, user_id))
        row = cursor.fetchone()
        
        if not row:
            return False, "Document not found"
            
        file_path = row['file_path']
        
        # 2. Delete record from database
        cursor.execute('DELETE FROM documents WHERE id = ? AND user_id = ?', (document_id, user_id))
        conn.commit()
        
        # 3. Delete file from filesystem
        if file_path and os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception as e:
                # Log error but don't fail the request since DB record is gone
                print(f"Error deleting file {file_path}: {e}")
                
        return True, "Document deleted successfully"
        
    except Exception as e:
        return False, str(e)
    finally:
        conn.close()

@router.delete("/api/documents/{document_id}")
async def delete_document(document_id: int, user_id: str):
    """
    Delete a document and its associated file.
    """
    try:
        success, message = _delete_document_helper(document_id, user_id)
        
        if not success:
            if message == "Document not found":
                raise HTTPException(status_code=404, detail="Document not found")
            else:
                raise HTTPException(status_code=500, detail=message)
                
        return {
            "success": True,
            "message": "Document deleted successfully"
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
