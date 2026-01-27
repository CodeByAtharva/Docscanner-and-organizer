
import sqlite3
import os

DB_NAME = "documents.db"

def check_last_error():
    if not os.path.exists(DB_NAME):
        print(f"Error: Database {DB_NAME} not found.")
        return

    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    try:
        print("Checking last document status...")
        cursor.execute("SELECT id, title, processing_status, error_message FROM documents ORDER BY id DESC LIMIT 1")
        row = cursor.fetchone()
        
        if not row:
            print("No documents found.")
        else:
            print(f"ID: {row['id']}")
            print(f"Title: {row['title']}")
            print(f"Status: {row['processing_status']}")
            print(f"Error Message: {row['error_message']}")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    check_last_error()
