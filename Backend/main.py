"""
Backend - FastAPI Application

Available Endpoints:
    GET /                    - Welcome message
    GET /health              - Health check endpoint
    GET /api/random-quote    - Sample endpoint to connect Frontend and Backend (generates random quote using Gemini LLM)

To run this server:
    uvicorn main:app --reload

The server will start at: http://localhost:8000
API documentation will be available at: http://localhost:8000/docs

Setup:
    1. Install dependencies: pip install -r requirements.txt
    2. Get your Google API key from: https://makersuite.google.com/app/apikey
    3. Create a .env file in the Backend directory with: GOOGLE_API_KEY=your_api_key_here
    4. Run the server: uvicorn main:app --reload
"""

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize Google Generative AI
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    print("Warning: GOOGLE_API_KEY not found in environment variables.")
    print("Please create a .env file with: GOOGLE_API_KEY=your_api_key_here")
    genai_configured = False
else:
    genai.configure(api_key=api_key)
    genai_configured = True


    
from contextlib import asynccontextmanager

# ... existing imports ...
from database import init_db
from routes import documents

# Define lifespan context manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Init DB and create uploads dir
    init_db()
    if not os.path.exists("uploads"):
        os.makedirs("uploads")
    yield

app = FastAPI(title="Backend API", version="0.1.0", lifespan=lifespan)

# Enable CORS (Cross-Origin Resource Sharing) to allow frontend to connect
# ... existing cors middleware ...
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite default port and common React port
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Include Routers
app.include_router(documents.router)

@app.get("/")
async def root():
    return {"message": "Hello from AI Interviewer Backend!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/random-quote")
async def get_random_quote():
    """
    Sample endpoint to connect Frontend and Backend.
    This is a simple example endpoint that generates a random inspirational quote using Google's Gemini LLM.
    Students can use this endpoint to practice connecting their React frontend to the FastAPI backend.
    
    Returns:
        JSON response with AI-generated random quote
    """
    if not genai_configured:
        raise HTTPException(
            status_code=500,
            detail="Google API key not configured. Please set GOOGLE_API_KEY in your .env file."
        )
    
    try:
        # Make a simple LLM call to generate a random quote
        model = genai.GenerativeModel('gemini-1.5-flash-lite')
        response = model.generate_content("Tell me a random inspirational quote")
        
        return {
            "success": True,
            "message": "Random quote generated successfully",
            "data": {
                "quote": response.text,
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating quote: {str(e)}"
        )

    