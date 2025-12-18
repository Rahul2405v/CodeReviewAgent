import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from app.graph import build_graph

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

graph = build_graph()

class CodeRequest(BaseModel):
    code: str

@app.post("/review")
def review_code(payload: CodeRequest):
    state = {
        "code": payload.code,
        "issues": [],
        "improved_code": "",
        "quality_score": 0
    }
    return graph.invoke(state)

if __name__ == "__main__":
    host = os.getenv("API_HOST", "0.0.0.0")
    port = int(os.getenv("API_PORT", "8000"))
    uvicorn.run("app.api:app", host=host, port=port, reload=True)
