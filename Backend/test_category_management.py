
import requests
import json
from database import get_db_connection

BASE_URL = "http://localhost:8000/api/documents"
USER_ID = "test_user_id"

def get_db_doc_category(doc_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT category FROM documents WHERE id = ?", (doc_id,))
    row = cursor.fetchone()
    conn.close()
    return row['category'] if row else None

def test_category_management():
    print("--- Testing Category Management ---")

    # 1. Get Categories
    print("\n1. Fetching available categories...")
    response = requests.get(f"{BASE_URL}/categories?user_id={USER_ID}")
    
    if response.status_code == 200:
        data = response.json()
        categories = data['categories']
        print(f"Success! Found {len(categories)} categories.")
        for cat in categories:
            print(f"  - {cat['name']}: {cat['count']}")
    else:
        print(f"Failed to fetch categories: {response.text}")
        return

    # 2. Update Document Category
    # Get a document ID first (assuming at least one exists from previous steps)
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, category FROM documents WHERE user_id = ? LIMIT 1", (USER_ID,))
    doc = cursor.fetchone()
    conn.close()

    if not doc:
        print("No documents found to test update.")
        return

    doc_id = doc['id']
    old_category = doc['category']
    new_category_name = "Legal" if old_category != "Legal" else "Finance"
    
    print(f"\n2. Updating Document {doc_id} from '{old_category}' to '{new_category_name}'...")
    
    response = requests.patch(
        f"{BASE_URL}/{doc_id}/category?user_id={USER_ID}",
        json={"category": new_category_name}
    )

    if response.status_code == 200:
        print("Update API call successful.")
        
        # Verify in DB
        current_category = get_db_doc_category(doc_id)
        if current_category == new_category_name:
             print("Database verification: PASSED")
        else:
             print(f"Database verification: FAILED (Expected {new_category_name}, got {current_category})")
             
        # Revert change for cleanliness
        requests.patch(
            f"{BASE_URL}/{doc_id}/category?user_id={USER_ID}",
            json={"category": old_category}
        )
        print("Reverted category change.")

    else:
        print(f"Update failed: {response.text}")

if __name__ == "__main__":
    test_category_management()
