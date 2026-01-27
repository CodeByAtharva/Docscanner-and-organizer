
from fastapi import APIRouter, File, UploadFile, HTTPException, Form, BackgroundTasks
from fastapi.responses import JSONResponse
import shutil
import os
import uuid
from datetime import datetime
from database import get_db_connection
from services.llm_service import process_document
import pydantic

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
async def get_documents(user_id: str, category: str = None):
    """
    Retrieve all documents for a specific user, optionally filtered by category.
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        if category and category != "All Categories":
            cursor.execute('''
                SELECT id, title, upload_date, content_type, file_path, extracted_text, processing_status, category 
                FROM documents 
                WHERE user_id = ? AND category = ?
                ORDER BY upload_date DESC
            ''', (user_id, category))
        else:
            cursor.execute('''
                SELECT id, title, upload_date, content_type, file_path, extracted_text, processing_status, category 
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
                "category": row['category'] if row['category'] else "Uncategorized", 
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

@router.get("/api/documents/categories")
async def get_categories(user_id: str):
    """
    Retrieve all categories with document counts.
    """
    try:
        categories = _get_categories_with_counts(user_id)
        return {
            "success": True,
            "categories": categories
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
            SELECT id, title, upload_date, content_type, file_path, extracted_text, processing_status, file_size, category
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
                "category": row['category'] if row['category'] else "Uncategorized",
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



# Helper Functions for Category Management
def _get_categories_with_counts(user_id: str):
    """
    Helper function to get all categories and their document counts for a user.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Group by category and count documents
        cursor.execute('''
            SELECT category, COUNT(*) as count
            FROM documents 
            WHERE user_id = ?
            GROUP BY category
        ''', (user_id,))
        
        rows = cursor.fetchall()
        categories = []
        
        # Define standard categories to ensure they always appear even if count is 0
        standard_categories = ["Invoice", "Receipt", "Contract", "Note", "Letter", "Form", "Other", "Uncategorized"]
        category_counts = {cat: 0 for cat in standard_categories}
        
        # Update with actual counts
        for row in rows:
            cat_name = row['category'] if row['category'] else "Uncategorized"
            # Normalize case just in case
            found = False
            for std_cat in standard_categories:
                if std_cat.lower() == cat_name.lower():
                    category_counts[std_cat] += row['count']
                    found = True
                    break
            if not found:
                # Add non-standard categories if any
                category_counts[cat_name] = row['count']
        
        # Convert to list
        result = [{"name": cat, "count": count} for cat, count in category_counts.items()]
        # Sort by name
        result.sort(key=lambda x: x['name'])
        
        return result
        
    except Exception as e:
        print(f"Error fetching categories: {e}")
        return []
    finally:
        conn.close()

def _update_document_category(document_id: int, user_id: str, new_category: str):
    """
    Helper function to update a document's category.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Check ownership
        cursor.execute('SELECT id FROM documents WHERE id = ? AND user_id = ?', (document_id, user_id))
        if not cursor.fetchone():
            return False, "Document not found or access denied"

        # Update category
        cursor.execute('UPDATE documents SET category = ? WHERE id = ?', (new_category, document_id))
        conn.commit()
        return True, "Category updated successfully"
        
    except Exception as e:
        return False, str(e)
    finally:
        conn.close()

def _search_documents(user_id: str, query: str):
    """
    Helper function to perform full-text search on documents.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # FTS5 Query
        # We join back to the main documents table to get all metadata
        # We use snippet() to highlight matches in extracted_text
        # snippet(documents_fts, column_index, start_marker, end_marker, trailing_text, max_tokens)
        
        # IMPORTANT: FTS queries can be complex. We need to sanitize safely or use parameters.
        # SQLite FTS parameters work for the match phrase.
        
        # For simplicity in this learning step, we use the standard match operator.
        # Ideally, we should sanitize `query` to prevent malformed FTS syntax errors.
        # A simple way is to wrap it in quotes if it doesn't have them, or just pass it as param.
        
        # Search against title, category, and extracted_text
        # We'll construct a query that matches any.
        
        # Note: FTS5 requires matching the virtual table. 
        # Rowid joins virtual table to main table.
        
        sql = '''
            SELECT 
                d.id, d.title, d.category, d.upload_date, d.processing_status,
                snippet(documents_fts, 1, '<b>', '</b>', '...', 15) as snippet
            FROM documents d
            JOIN documents_fts fts ON d.id = fts.rowid
            WHERE documents_fts MATCH ? AND d.user_id = ?
            ORDER BY rank
        '''
        
        # We'll use prefix search for better UX (append *)
        # Wrap query in quotes to handle special characters (like hyphens) and treat as phrase
        search_term = f'"{query}"*'
        
        cursor.execute(sql, (search_term, user_id))
        rows = cursor.fetchall()
        
        results = []
        for row in rows:
            results.append({
                "id": row['id'],
                "title": row['title'],
                "category": row['category'],
                "date": row['upload_date'],
                "status": row['processing_status'],
                "snippet": row['snippet']
            })
            
        return results
        
    except Exception as e:
        print(f"Search error: {e}")
        return []
    finally:
        conn.close()

@router.get("/api/search")
async def search_documents(q: str, user_id: str):
    """
    Search documents using Full Text Search.
    """
    if not q:
        return {"success": True, "count": 0, "results": []}
        
    try:
        results = _search_documents(user_id, q)
        return {
            "success": True, 
            "count": len(results), 
            "results": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))




class CategoryUpdate(pydantic.BaseModel):
    category: str

@router.patch("/api/documents/{document_id}/category")
async def update_category(document_id: int, category_update: CategoryUpdate, user_id: str):
    """
    Update the category of a document.
    """
    try:
        success, message = _update_document_category(document_id, user_id, category_update.category)
        
        if not success:
            if "not found" in message:
                raise HTTPException(status_code=404, detail=message)
            else:
                raise HTTPException(status_code=500, detail=message)
                
        return {
            "success": True,
            "message": message,
            "category": category_update.category
        }

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
