# Document Scanner and Organizer

A web application that allows users to scan and upload documents (images or PDFs), automatically extract text content using vision-enabled LLM, categorize documents using AI, and make them searchable through a full-text search interface.

---

## Project Overview

### Description

The Document Scanner and Organizer transforms physical documents into organized, searchable digital files with automatic text extraction and AI-powered categorization. Users can quickly find any document by searching through extracted text content, eliminating the need for manual filing and organization systems.

### Target Users

- Professionals who need to digitize and organize paper documents
- Students who want to scan and organize lecture notes and handouts
- Small business owners managing invoices, receipts, and contracts
- Anyone who needs to convert physical documents into searchable digital format

### Core Value Proposition

Transform physical documents into organized, searchable digital files with automatic text extraction and AI-powered categorization. Users can quickly find any document by searching through extracted text content.

---

## Technology Stack

### Frontend
- React 19
- Vite (build tool)
- Tailwind CSS (styling)
- React Router DOM (routing)
- Axios or Fetch (API calls)

### Backend
- Python 3.12+
- FastAPI (REST API)
- Uvicorn (ASGI server)
- Pydantic (data validation)

### Database
- SQLite (for application data ONLY, NOT authentication)

### Authentication
- Firebase Authentication (email/password)
- Firebase SDK in frontend

### AI/ML
- LangChain (basic chains for text extraction and categorization)
- Google Gemini Vision LLM (for image understanding and text extraction)

### Development Tools
- UV (Python package manager)
- npm (Node package manager)
- Git (version control)

---

## Features

- User authentication with Firebase
- Upload document images (single or multi-page)
- Scan multi-page documents (extract text from first 2 pages only for search)
- Automatic text extraction using vision-enabled LLM
- AI-based document categorization
- Full-text search across all documents
- View document details with extracted text
- Organize documents by category
- Filter documents by category on Dashboard
- Delete documents
- Document metadata storage (title, date, category)

---

## Architecture

### Frontend Structure

**Pages:**
- Landing (`/`) - Welcome page with app info
- Signup (`/signup`) - User registration
- Login (`/login`) - User authentication
- Dashboard (`/dashboard`) - Main user interface with document list and category filtering
- Document Detail (`/documents/:id`) - View single document with extracted text
- Profile (`/profile`) - User profile settings

**Key Components:**
- Navbar - Navigation header
- DocumentList - Display documents grid/list
- DocumentCard - Single document card
- UploadModal - Upload interface
- DocumentViewer - Display original document file
- ExtractedTextView - Display extracted text
- CategoryFilter - Filter documents by category
- CategoryHeader - Shows selected category and count
- CategorySelector - Change document category
- SearchBar - Search interface

### Backend Structure

**API Endpoints:**
- POST /api/documents - Upload new document (with LLM processing)
- GET /api/documents - Get all user documents (optionally filter by category)
- GET /api/documents/:id - Get single document with extracted text
- GET /api/documents/file/:id - Serve original document file for viewing
- DELETE /api/documents/:id - Delete document
- GET /api/documents/categories - Get all categories with counts
- GET /api/search - Search documents by text
- PATCH /api/documents/:id/category - Update document category

**Database:**
- SQLite database for document metadata and extracted text
- FTS (Full-Text Search) extension for efficient searching
- Tables: documents, categories

---

## Issue Flow

### Foundation (Issues 1-8)
1. **Project Setup** - Initialize project structure and dependencies
2. **Landing Page UI** - Create static landing page
3. **Signup Page UI** - Create static signup form
4. **Login Page UI** - Create static login form
5. **Firebase Auth Setup** - Configure Firebase project and SDK
6. **Integrate Signup with Firebase** - Connect signup form to Firebase
7. **Integrate Login with Firebase** - Connect login form to Firebase
8. **Dashboard UI** - Create protected dashboard page

### Core Features (Issues 9-15)
9. **Upload Document Feature** - Implement file upload (backend + frontend)
10. **Process Document with Vision LLM** - Extract text using LangChain + Vision LLM
11. **Display Documents** - Show user documents on dashboard
12. **Document Detail View** - View single document with file viewer
13. **Delete Document Feature** - Remove documents from system
14. **AI Categorization** - Automatically categorize documents during processing
15. **Category Management** - View categories and update document categories

### Advanced Features (Issues 16-18)
16. **Search Feature** - Full-text search through documents
17. **Category Filtering on Dashboard** - Filter documents by category
18. **First 2 Pages Text Extraction** - Optimize multi-page PDF processing

### Final (Issue 19)
19. **Final Testing** - Complete flow verification and documentation

---

## Key Implementation Details

### Document Processing

**Single-Page Documents:**
- Process entire document with vision LLM
- Extract all text content
- Store in database

**Multi-Page Documents:**
- Extract first 2 pages only
- Process each page separately with vision LLM
- Combine text from both pages
- Store combined text in database
- Original full PDF is still stored for viewing

### Text Extraction

- Uses LangChain with Google Gemini Vision LLM
- NO OCR libraries (PyTesseract, etc.)
- Extracted text stored in SQLite database
- Full-text search using SQLite FTS extension

### Categorization

- AI analyzes extracted text during processing
- LangChain chains determine appropriate category
- Categories: Invoices, Receipts, Contracts, Notes, Letters, Forms, etc.
- Category stored with document metadata

### Search

- SQLite FTS extension for full-text search
- Searches through extracted text content
- Returns documents with matching snippets
- Supports partial word matching and multiple word queries

---

## Development Guidelines

### Important Reminders

- **NO OCR libraries** - Use vision-enabled LLM only (Gemini Vision)
- **NO PostgreSQL** - Use SQLite for all data storage
- **NO JWT/OAuth** - Use Firebase Authentication only
- Process documents asynchronously to avoid blocking
- Provide clear feedback during document processing
- Handle errors gracefully (invalid images, processing failures)

### Developer Flexibility

- Component names can be changed
- Additional components can be added
- Endpoint paths can be modified
- Database schema can be improved
- Categories can be customized
- The goal is a working, well-designed application

---

## Getting Started

1. Complete Issue #01 (Project Setup) to initialize the project
2. Follow issues sequentially from #02 onwards
3. Each issue builds upon previous work
4. Refer to individual issue files for detailed implementation guidance

---

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [LangChain Documentation](https://python.langchain.com/docs/get_started/introduction)
- [Google Gemini Vision API](https://ai.google.dev/docs)
- [SQLite FTS Documentation](https://www.sqlite.org/fts5.html)

---

## License

This is a template project for educational purposes.
