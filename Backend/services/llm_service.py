
import os
import fitz  # PyMuPDF
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage
from database import get_db_connection
import base64

# Initialize the Vision Model
# Using gemini-1.5-flash for cost efficiency
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash-lite")

async def process_document(document_id: int, file_path: str):
    """
    Background task to process the document:
    1. Extract images (first 2 pages for PDF, or the image itself).
    2. Send to Gemini Vision for text extraction.
    3. Update database with result.
    """
    print(f"Starting processing for document {document_id}...")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Update status to processing
        cursor.execute("UPDATE documents SET processing_status = ? WHERE id = ?", ('processing', document_id))
        conn.commit()

        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")

        file_ext = os.path.splitext(file_path)[1].lower()
        image_contents = []

        # 1. Prepare Image Content
        if file_ext == '.pdf':
            doc = fitz.open(file_path)
            # Process up to first 2 pages
            num_pages = min(2, len(doc))
            for i in range(num_pages):
                page = doc.load_page(i)
                pix = page.get_pixmap()
                img_data = pix.tobytes("png")
                b64_data = base64.b64encode(img_data).decode("utf-8")
                image_contents.append(
                    {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{b64_data}"}}
                )
            doc.close()
        elif file_ext in ['.jpg', '.jpeg', '.png']:
            with open(file_path, "rb") as image_file:
                img_data = image_file.read()
                b64_data = base64.b64encode(img_data).decode("utf-8")
                mime_types = {'.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png'}
                mime_type = mime_types.get(file_ext, 'image/jpeg')
                image_contents.append(
                    {"type": "image_url", "image_url": {"url": f"data:{mime_type};base64,{b64_data}"}}
                )
        else:
             raise ValueError(f"Unsupported file type: {file_ext}")

        if not image_contents:
            raise ValueError("No content could be extracted from the file.")

        # 2. Call LLM
        prompt_text = "Extract all the text content from this document. If it is a multi-page document, I have provided the first few pages. Output only the extracted text, preserving the structure as much as possible."
        
        message = HumanMessage(
            content=[
                {"type": "text", "text": prompt_text},
                *image_contents
            ]
        )
        
        response = llm.invoke([message])
        extracted_text = response.content
        if not isinstance(extracted_text, str):
            print(f"Warning: extracted_text is not a string, type: {type(extracted_text)}")
            extracted_text = str(extracted_text)

        print(f"Extracted text type: {type(extracted_text)}")
        # 3. Save Result
        cursor.execute(
            "UPDATE documents SET processing_status = ?, extracted_text = ? WHERE id = ?", 
            ('completed', extracted_text, document_id)
        )
        conn.commit()
        print(f"Document {document_id} processed successfully.")

    except Exception as e:
        print(f"Error processing document {document_id}: {e}")
        error_msg = str(e)
        cursor.execute(
            "UPDATE documents SET processing_status = ?, error_message = ? WHERE id = ?", 
            ('failed', error_msg, document_id)
        )
        conn.commit()
    finally:
        conn.close()
