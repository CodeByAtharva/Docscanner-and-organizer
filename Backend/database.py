
import sqlite3
import os
from datetime import datetime

DB_NAME = "documents.db"

def get_db_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    try:
        # Create table with new schema if it doesn't exist
        conn.execute('''
            CREATE TABLE IF NOT EXISTS documents (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                filename TEXT NOT NULL,
                file_path TEXT NOT NULL,
                title TEXT,
                content_type TEXT,
                upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                file_size INTEGER,
                extracted_text TEXT,
                processing_status TEXT DEFAULT 'pending',
                error_message TEXT,
                category TEXT DEFAULT 'Uncategorized'
            )
        ''')
        
        # Check if columns exist (migration for existing db)
        cursor = conn.cursor()
        cursor.execute("PRAGMA table_info(documents)")
        columns = [info[1] for info in cursor.fetchall()]
        
        if 'extracted_text' not in columns:
            print("Migrating database: adding extracted_text column")
            conn.execute("ALTER TABLE documents ADD COLUMN extracted_text TEXT")
            
        if 'processing_status' not in columns:
            print("Migrating database: adding processing_status column")
            conn.execute("ALTER TABLE documents ADD COLUMN processing_status TEXT DEFAULT 'pending'")
            
        if 'error_message' not in columns:
            print("Migrating database: adding error_message column")
            conn.execute("ALTER TABLE documents ADD COLUMN error_message TEXT")
            
        if 'category' not in columns:
            print("Migrating database: adding category column")
            conn.execute("ALTER TABLE documents ADD COLUMN category TEXT DEFAULT 'Uncategorized'")
            
        conn.commit()
        print(f"Database {DB_NAME} initialized successfully.")
    except Exception as e:
        print(f"Error initializing database: {e}")
    finally:
        conn.close()
