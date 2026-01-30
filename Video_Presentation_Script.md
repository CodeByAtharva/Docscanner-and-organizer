# Document Scanner & Organizer - Project Presentation Script

**Project Title:** Intelligent Document Scanner & Organizer
**Date:** 28/01/2026

---

## 1. Introduction
"Hello, in this video I will be presenting my project, the **Intelligent Document Scanner & Organizer**. This is a full-stack web application designed to digitize, organize, and manage physical documents using the power of AI. It solves the problem of manual data entry and organization by automatically extracting text and categorizing documents like Invoices, Receipts, and Contracts immediately upon upload."

---

## 2. Tech Stack Overview
"For this project, I used a modern and robust tech stack:"
*   **Frontend:** Built with **React 19** and **Vite** for a fast, responsive user interface. I used **Tailwind CSS** for styling and **Firebase** for secure authentication.
*   **Backend:** Powered by **FastAPI** (Python), chosen for its high performance and native support for asynchronous background tasks.
*   **Database:** **SQLite**, utilizing its advanced **FTS5** (Full-Text Search) engine for powerful search capabilities.
*   **AI/ML:** **Google Gemini Vision LLM** via LangChain for optical character recognition (OCR) and document categorization.

---

## 3. Project Workflow
"Let me walk you through the core workflow of the application:"

1.  **User Onboarding:** The user signs up or logs in. We use **Firebase Authentication** to handle identity. Using a `RequireAuth` component in React, we ensure that the Dashboard and Document details are strictly protected.
2.  **Document Upload:** On the dashboard, a user uploads a file (PDF or Image).
3.  **Asynchronous Processing:**
    *   The Frontend sends the file to the Backend.
    *   The Backend saves the file and immediately acknowledges the upload, setting the status to 'Pending'.
    *   Crucially, it triggers a **Background Task** to handle the heavy AI processing, so the user doesn't have to wait.
4.  **AI Analysis (The Brain):**
    *   In the background, the **Gemini Vision model** "reads" the document (converting PDFs to images if necessary).
    *   It extracts all text and then analyzes that text to determine the **Category** (e.g., 'Invoice', 'Medical Record').
5.  **Organization & Search:**
    *   The extracted text and category are saved to the database.
    *   The user can now **Search** for any keyword found within the document content, not just the filename, thanks to our Full-Text Search implementation.

---

## 4. Key Issues Solved & Code Implementation
"During development, I encountered and solved several key technical challenges. Here is how I addressed them in the code:"

### Issue 1: User Isolation (Data Privacy)
**Challenge:** We needed to ensure that User A specifically cannot see or access User B's documents.
**Solution:** I implemented strict ownership checks at the database query level. Every single database operation requires the `user_id`.
**Code Highlight:**
In `Backend/routes/documents.py`:
```python
# API Endpoint ensuring data isolation
@router.get("/api/documents")
async def get_documents(user_id: str):
    cursor.execute('''
        SELECT ... FROM documents 
        WHERE user_id = ?  <-- strict filtering by user_id
    ''', (user_id,))
```
This pattern is repeated for Deletion, Search, and Updates, ensuring complete data isolation.

### Issue 2: AI Latency & User Experience
**Challenge:** AI processing takes time (5-10 seconds). Blocking the HTTP request would make the app feel unresponsive.
**Solution:** I utilized FastAPI's `BackgroundTasks` to offload processing.
**Code Highlight:**
In `Backend/routes/documents.py`:
```python
@router.post("/api/documents")
async def upload_document(background_tasks: BackgroundTasks, ...):
    # ... save file locally ...
    
    # Return response immediately
    background_tasks.add_task(process_document, document_id, file_path)
    
    return {"status": "pending", "message": "Upload successful, processing started."}
```

### Issue 3: Efficient Content Discovery
**Challenge:** Standard database searches (LIKE %query%) are slow and inefficient for large amounts of extracted text.
**Solution:** I implemented **SQLite FTS5 (Full Text Search)**. I created a virtual table specifically for indexing text and used Database Triggers to keep it automatically synced with the main data.
**Code Highlight:**
In `Backend/database.py`:
```python
# Creating the virtual table for high-performance search
conn.execute('''
    CREATE VIRTUAL TABLE IF NOT EXISTS documents_fts USING fts5(
        title, extracted_text, category, ...
    )
''')
# Triggers ensure any new document is automatically indexed
```
This allows users to find a receipt by searching for the "Merchant Name" buried inside the text, effectively instantly.

### Issue 4: Deep Dive - Process Document with Vision LLM
**Challenge:** The core requirement was to extract text from various document formats (Images, PDFs) without relying on traditional, error-prone OCR libraries like Tesseract. We needed a solution that was accurate and modern.
**Solution:** I implemented a complete pipeline using **LangChain** and **Google Gemini Vision**.

**Implementation Detail 1: LangChain & Vision Integration**
Instead of rigid OCR, I used `ChatGoogleGenerativeAI` from LangChain. This allows us to "chat" with the document images, asking the model to "Extract all text preserving structure".

**Implementation Detail 2: Smart PDF Handling (Multi-page Logic)**
Sending an entire 50-page PDF to an LLM is slow and costly.
*   **Logic:** I wrote a specific handler that checks if a file is a PDF.
*   **Constraint:** It processes ONLY the **first 2 pages** (Cover page and details), which usually contain the most relevant info for categorization.
*   **Conversion:** It uses `PyMuPDF` to convert these specific PDF pages into high-quality images before sending them to the Vision model.

**Implementation Detail 3: Robust Error Handling**
AI services can fail (timeouts, quota limits).
*   I wrapped the processing logic in `try/except` blocks.
*   If LLM extraction fails, the database status updates to `failed` with the error message, ensuring the frontend knows something went wrong instead of hanging indefinitely.

**Code Highlight:**
In `Backend/services/llm_service.py`:
```python
# Smart handling for PDFs vs Images
if file_ext == '.pdf':
    # Enforce 2-page limit for efficiency
    num_pages = min(2, len(doc))
    for i in range(num_pages):
        # Convert specific page to Image for Vision LLM
        pix = page.get_pixmap()
        # ... logic to send to Gemini ...
        
    extracted_text_parts.append(page_text)
    
# Error Handling ensuring system stability
except Exception as e:
    cursor.execute(
        "UPDATE documents SET processing_status = 'failed', error_message = ?", 
        (str(e),)
    )
```

---

## 5. Conclusion
"In summary, the **Document Scanner & Organizer** connects a modern React frontend with a high-performance Python backend. By leveraging Agentic AI workflows, I was able to build a system that not only stores files but truly understands them, solving the core user problem of document clutter. Thank you."
