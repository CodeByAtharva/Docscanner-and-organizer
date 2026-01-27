
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
            
        # --- Full Text Search Setup ---
        # Create FTS virtual table
        conn.execute('''
            CREATE VIRTUAL TABLE IF NOT EXISTS documents_fts USING fts5(
                title,
                extracted_text,
                category,
                content='documents',
                content_rowid='id'
            )
        ''')

        # Triggers to keep FTS table in sync
        # INSERT Trigger
        conn.execute('''
            CREATE TRIGGER IF NOT EXISTS documents_ai AFTER INSERT ON documents BEGIN
                INSERT INTO documents_fts(rowid, title, extracted_text, category) 
                VALUES (new.id, new.title, new.extracted_text, new.category);
            END;
        ''')

        # DELETE Trigger
        conn.execute('''
            CREATE TRIGGER IF NOT EXISTS documents_ad AFTER DELETE ON documents BEGIN
                INSERT INTO documents_fts(documents_fts, rowid, title, extracted_text, category) 
                VALUES('delete', old.id, old.title, old.extracted_text, old.category);
            END;
        ''')

        # UPDATE Trigger
        conn.execute('''
            CREATE TRIGGER IF NOT EXISTS documents_au AFTER UPDATE ON documents BEGIN
                INSERT INTO documents_fts(documents_fts, rowid, title, extracted_text, category) 
                VALUES('delete', old.id, old.title, old.extracted_text, old.category);
                INSERT INTO documents_fts(rowid, title, extracted_text, category) 
                VALUES (new.id, new.title, new.extracted_text, new.category);
            END;
        ''')

        # Populate FTS if empty (Migration)
        cursor.execute("SELECT count(*) as count FROM documents_fts")
        fts_count = cursor.fetchone()['count']
        if fts_count == 0:
            cursor.execute("SELECT count(*) as count FROM documents")
            doc_count = cursor.fetchone()['count']
            if doc_count > 0:
                 print("Migrating database: Populating FTS index...")
                 conn.execute("INSERT INTO documents_fts(rowid, title, extracted_text, category) SELECT id, title, extracted_text, category FROM documents")

        conn.commit()
        print(f"Database {DB_NAME} initialized successfully.")
    except Exception as e:
        print(f"Error initializing database: {e}")
    finally:
        conn.close()
