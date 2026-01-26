
import requests
import os
import time

# Create a dummy PDF file
with open("test_doc.pdf", "wb") as f:
    f.write(b"%PDF-1.5 test content")

url = "http://localhost:8001/api/documents"
files = {'file': ('test_doc.pdf', open('test_doc.pdf', 'rb'), 'application/pdf')}
data = {'user_id': 'test_verifier'}

try:
    print(f"Testing upload to {url}...")
    # Retry logic since server might take a moment
    for i in range(5):
        try:
            response = requests.post(url, files=files, data=data)
            break
        except requests.exceptions.ConnectionError:
            print("Server not ready, retrying...")
            time.sleep(1)
    else:
        print("❌ Could not connect to server after 5 attempts")
        exit(1)
    
    if response.status_code == 201:
        print("✅ Upload successful!")
        data = response.json()
        print("Response:", data)
        
        # Verify file exists
        if 'document' in data:
            file_path = data['document']['file_path'] 
            if os.path.exists(file_path):
                print(f"✅ File found at {file_path}")
            else:
                print(f"❌ File NOT found at {file_path}")
        else:
             print("❌ key 'document' not found in response")
             
    else:
        print(f"❌ Upload failed with status {response.status_code}")
        print("Response:", response.text)

except Exception as e:
    print(f"❌ Error: {e}")

finally:
    # Cleanup
    if os.path.exists("test_doc.pdf"):
        os.remove("test_doc.pdf")
