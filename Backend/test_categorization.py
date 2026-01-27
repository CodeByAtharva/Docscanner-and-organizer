
import sqlite3
import os

DB_NAME = "documents.db"

def check_categorization():
    if not os.path.exists(DB_NAME):
        print(f"Error: Database {DB_NAME} not found.")
        return

    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    try:
        # 1. Check schema
        print("Checking database schema...")
        cursor.execute("PRAGMA table_info(documents)")
        columns = [info[1] for info in cursor.fetchall()]
        if 'category' in columns:
            print("PASS: 'category' column exists in 'documents' table.")
        else:
            print("FAIL: 'category' column MISSING.")

        # 2. Check content
        print("\nChecking document categories...")
        cursor.execute("SELECT id, title, category, processing_status FROM documents ORDER BY id DESC LIMIT 5")
        rows = cursor.fetchall()
        
        if not rows:
            print("No documents found.")
        else:
            print(f"{'ID':<5} {'Title':<30} {'Category':<15} {'Status':<10}")
            print("-" * 65)
            for row in rows:
                category = row['category'] if row['category'] else 'None'
                print(f"{row['id']:<5} {row['title'][:28]:<30} {category:<15} {row['processing_status']:<10}")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    check_categorization()
