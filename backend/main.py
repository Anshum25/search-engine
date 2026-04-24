import os
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load env variables from .env if present
load_dotenv()

from rag_pipeline import RAGPipeline, SearchResponseModel

app = FastAPI(title="NovaMind Python Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize global pipeline instance
rag = RAGPipeline()

@app.get("/api/search", response_model=SearchResponseModel)
async def search_endpoint(q: str = Query(..., min_length=1), tab: str = "all"):
    """
    Main Search Endpoint: executes true RAG pipeline returning structured search and AI responses.
    """
    if len(q) > 500:
        raise HTTPException(status_code=400, detail="Query too long")
        
    try:
        res = await rag.execute_search(q, tab)
        return res
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Search pipeline failed: {str(e)}")

@app.get("/api/suggest")
async def suggest_endpoint(q: str = Query(..., min_length=1)):
    """
    Query suggestions endpoint.
    """
    suggestions = [
        {"text": f"{q} explained", "type": "suggestion"},
        {"text": f"{q} tutorial", "type": "suggestion"},
        {"text": f"what is {q}", "type": "suggestion"},
        {"text": f"best {q} options", "type": "suggestion"},
    ]
    return {"suggestions": suggestions}

if __name__ == "__main__":
    import uvicorn
    # run locally inside the module
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
