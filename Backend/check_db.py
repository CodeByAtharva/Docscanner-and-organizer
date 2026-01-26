
import sqlite3

def check_db():
    conn = sqlite3.connect("documents.db")
    cursor = conn.cursor()
    cursor.execute("SELECT id, title, processing_status, length(ifnull(extracted_text, '')) as text_len FROM documents ORDER BY id DESC LIMIT 5")
    rows = cursor.fetchall()
    print("Recent Documents:")
    for row in rows:
        print(f"ID: {row[0]}, Title: {row[1]}, Status: {row[2]}, Text Len: {row[3]}")
    conn.close()

if __name__ == "__main__":
    check_db()
