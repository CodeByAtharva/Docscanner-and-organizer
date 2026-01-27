
import requests
import json
import time

BASE_URL = "http://localhost:8000/api"
USER_ID = "test_user_id"

def test_search():
    print("--- Testing Search Feature ---")

    # 1. Search for a common term (e.g., "invoice", "total", or "the")
    # First, let's see what documents we have to pick a good query
    docs_response = requests.get(f"{BASE_URL}/documents?user_id={USER_ID}")
    if docs_response.status_code != 200:
        print("Failed to fetch documents")
        return
    
    docs = docs_response.json().get('documents', [])
    if not docs:
        print("No documents found, cannot test search.")
        return

    print(f"Index has {len(docs)} documents.")
    
    # Pick a query from the first document's title or category
    test_doc = docs[0]
    query = test_doc['title'].split('.')[0] # Use part of the filename
    if len(query) < 3: query = "document" 

    print(f"\n1. Searching for '{query}'...")
    search_resp = requests.get(f"{BASE_URL}/search?q={query}&user_id={USER_ID}")
    
    if search_resp.status_code == 200:
        data = search_resp.json()
        print(f"Success! Found {data['count']} results.")
        for res in data['results']:
            print(f"  - [{res['id']}] {res['title']} ({res['category']})")
            if res['snippet']:
                print(f"    Snippet: {res['snippet']}")
    else:
        print(f"Search failed: {search_resp.text}")

    # 2. Test Snippet Highlighting
    # We expect <b> tags in the snippet
    if search_resp.status_code == 200 and data['count'] > 0:
        if '<b>' in data['results'][0]['snippet']:
             print("\n2. Snippet highlighting verification: PASSED (Found <b> tags)")
        else:
             print("\n2. Snippet highlighting verification: WARNING (No <b> tags found, maybe query matched title/category but not text?)")

    # 3. Test Empty Search
    print(f"\n3. Testing empty search...")
    empty_resp = requests.get(f"{BASE_URL}/search?q=&user_id={USER_ID}")
    if empty_resp.status_code == 200:
        print(f"Empty search returned count: {empty_resp.json()['count']} (Expected 0)")
    else:
        print("Empty search failed.")

if __name__ == "__main__":
    test_search()
