# Document Scanner and Organizer - Project Documentation

## 1. Application Overview
The **Document Scanner and Organizer** is a full-stack web application designed to help users digitize, organize, and manage their physical documents. It leverages AI/LLM technology to automatically extract text and categorize documents upon upload.

### Key Features
- **Smart Upload**: Upload images or PDFs. Multi-page PDFs are automatically processed (first 2 pages) for efficiency.
- **AI Text Extraction**: Uses Google Gemini Vision LLM to extract text from documents.
- **Automatic Categorization**: Automatically categorizes documents into types like Invoice, Receipt, Contract, etc.
- **Full-Text Search**: Instantly search through document content using a powerful FTS5 engine.
- **Category Filtering**: Filter documents by category with real-time updates.
- **Secure Authentication**: User signup and login powered by Firebase Authentication.
- **User Isolation**: Data privacy is ensuring users can only view and manage their own documents.
- **Optimized Onboarding**: Seamless signup process with auto-redirection to the dashboard.

---

## 2. Tech Stack

### Frontend
- **React 19**: Modern UI library with Hooks.
- **Vite**: Fast build tool and dev server.
- **Tailwind CSS**: Utility-first CSS framework for responsive design.
- **Firebase Auth**: Secure user authentication.
- **React Router**: Client-side routing.

### Backend
- **FastAPI**: High-performance Python web framework.
- **SQLite**: Lightweight relational database.
- **LangChain & Google Gemini**: AI processing pipeline.
- **PyMuPDF (fitz)**: PDF processing and image conversion.

---

## 3. Architecture & Data Flow

### Database Schema (`documents.db`)
- **documents Table**:
    - `id`: Primary Key
    - `user_id`: Owner of the document
    - `title`: Filename
    - `extracted_text`: Text content from LLM
    - `category`: Document type (Invoice, Receipt, etc.)
    - `processing_status`: pending, processing, completed, failed
    - `file_path`: Local path to file
    - `upload_date`: Timestamp
- **documents_fts Virtual Table**:
    - Used for Full-Text Search, synchronized via triggers.

### Data Flow
1.  **Upload**: User uploads file -> Frontend sends to `POST /api/documents`.
2.  **Storage**: File saved locally, metadata stored in DB (status: 'pending').
3.  **Processing (Background Task)**:
    - Text extracted using Gemini Vision (first 2 pages for PDF).
    - Text categorized by LLM.
    - DB updated with text and category (status: 'completed').
4.  **Retrieval**: Frontend polls/fetches from `GET /api/documents`.

---

## 4. Frontend Application Structure

### Pages
| Page | Route | Auth Required | Description |
|------|-------|---------------|-------------|
| **Landing** | `/` | No | Introduction to the application with CTA. |
| **Login** | `/login` | No | User sign-in form. |
| **Signup** | `/signup` | No | New user registration. |
| **Dashboard** | `/dashboard` | **Yes** | Main interface. Shows document list, search, filter, and upload. |
| **DocumentDetail**| `/documents/:id` | **Yes** | View specific document details and content. |

### Key Components
- `RequireAuth`: HOC to protect private routes.
- `DocumentList`: Grid view of documents with search/filter support.
- `CategoryHeader`: Context header showing active filter.
- `UploadModal`: Interface for selecting and uploading files.

---

## 5. Backend API Reference

Base URL: `http://localhost:8000`

### Documents
- **`POST /api/documents`**
    - **Description**: Upload a new document.
    - **Body**: `file` (Multipart), `user_id` (Form).
    - **Response**: Created document metadata.
- **`GET /api/documents`**
    - **Description**: Get all documents or filter by category.
    - **Query Params**: `user_id`, `category` (optional).
- **`DELETE /api/documents/{id}`**
    - **Description**: Delete a document and its file.
    - **Query Params**: `user_id`.
- **`GET /api/documents/categories`**
    - **Description**: Get category counts for the user.
- **`GET /api/search`**
    - **Description**: Full-text search with highlighting.
    - **Query Params**: `q` (query), `user_id`.

---

## 6. Setup & Run

### Prerequisites
- Python 3.9+
- Node.js 16+
- Google Gemini API Key
- Firebase Project Config

### Running Backend
```bash
cd Backend
# Install dependencies
pip install -r requirements.txt
# Create .env file with GOOGLE_API_KEY
# Run server
uvicorn main:app --reload
```

### Running Frontend
```bash
cd Frontend
# Install dependencies
npm install
# Run dev server
npm run dev
```

---

