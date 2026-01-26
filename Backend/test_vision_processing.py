
import requests
import sqlite3
import time
import os

# 1. Upload a File
url = "http://localhost:8001/api/documents"
# Create a dummy PDF (with some text if possible, but for vision we might need a real image/pdf. 
# Since we can't easily generate a valid PDF with text for vision without libraries, 
# we will rely on the fact that we implemented handling.
# Ideally we upload a real small image. Let's create a small text file pretending to be an image? No, that won't work for Vision.
# Let's try to upload a dummy text file renamed as .txt and see if it fails (validation), 
# OR just create a very simple valid PDF using minimal bytes if possible, or just fail if we don't have a real file.
# Better: Create a text file, but we are testing PDF/Image. 
# Let's assume the user has a file or we just test the flow with a dummy file that might fail LLM but pass upload.
# actually `pymupdf` will fail on invalid PDF.
# Let's try to create a minimal valid PDF using reportlab or just raw bytes if we knew them.
# Alternative: skip 'real' vision success verification and just check that it TRIES to process (status changes).
# But we want to see 'completed'.
# Let's try to use a minimal valid 1-page PDF.
min_pdf = b'%PDF-1.0\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 3 3]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000010 00000 n\n0000000060 00000 n\n0000000157 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n249\n%%EOF'

with open("test_vision.pdf", "wb") as f:
    f.write(min_pdf)

files = {'file': ('test_vision.pdf', open('test_vision.pdf', 'rb'), 'application/pdf')}
data = {'user_id': 'vision_tester'}

print("Uploading file...")
try:
    response = requests.post(url, files=files, data=data)
    if response.status_code == 201:
        # Correctly access the JSON body
        res_json = response.json()
        doc_id = res_json['document']['id']
        print(f"Upload success. Document ID: {doc_id}")
        
        # 2. Poll Database for Status
        print("Polling database for processing status...")
        conn = sqlite3.connect("documents.db")
        cursor = conn.cursor()
        
        for i in range(20): # Wait up to 20 seconds
            cursor.execute("SELECT processing_status, extracted_text, error_message FROM documents WHERE id = ?", (doc_id,))
            row = cursor.fetchone()
            status, text, error = row
            print(f"Status: {status}")
            
            if status == 'completed':
                print("✅ Processing Completed!")
                print(f"Extracted Text: {text[:100]}...") # Show beginning
                break
            elif status == 'failed':
                print("❌ Processing Failed!")
                print(f"Error: {error}")
                break
            
            time.sleep(1)
        else:
            print("❌ Timed out waiting for processing.")
            
        conn.close()
    else:
        print(f"Upload failed: {response.text}")

except Exception as e:
    print(f"Error: {e}")

finally:
    if os.path.exists("test_vision.pdf"):
        pass # os.remove("test_vision.pdf") # keep for debugging if needed
