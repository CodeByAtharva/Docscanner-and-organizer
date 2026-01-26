
import asyncio
import os
from dotenv import load_dotenv

# Load env before importing service which might init LLM
load_dotenv()

from services.llm_service import process_document
from database import get_db_connection

async def recover_pending():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Find Pending or Processing (stuck) documents
    cursor.execute("SELECT id, file_path FROM documents WHERE processing_status IN ('pending', 'processing')")
    rows = cursor.fetchall()
    conn.close()
    
    print(f"Found {len(rows)} documents to recover.")
    
    for row in rows:
        doc_id = row['id']
        file_path = row['file_path']
        print(f"Reprocessing Document ID: {doc_id} ({file_path})")
        try:
            await process_document(doc_id, file_path)
            print(f"Recovered Document {doc_id}")
        except Exception as e:
            print(f"Failed to recover {doc_id}: {e}")

if __name__ == "__main__":
    asyncio.run(recover_pending())
