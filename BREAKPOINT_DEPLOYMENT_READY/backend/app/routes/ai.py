import os
from fastapi import APIRouter, HTTPException, Depends
from ..models import User
from .auth import current_user
from pydantic import BaseModel, Field

router = APIRouter(prefix="/api/ai", tags=["ai"])

class AIRequest(BaseModel):
    prompt: str = Field(min_length=1, max_length=6000)
    context: dict = Field(default_factory=dict)

@router.get("/status")
def ai_status(user: User = Depends(current_user)):
    return {"configured": bool(os.getenv("OPENAI_API_KEY")), "model": os.getenv("OPENAI_MODEL", "gpt-5.6-luna")}

@router.post("/analyze")
def analyze(payload: AIRequest, user: User = Depends(current_user)):
    key = os.getenv("OPENAI_API_KEY")
    if not key:
        raise HTTPException(503, "AI is not configured. Add OPENAI_API_KEY to the backend environment.")
    from openai import OpenAI
    client = OpenAI(api_key=key)
    model = os.getenv("OPENAI_MODEL", "gpt-5.6-luna")
    system = (
        "You are BREAKPOINT AI Security Analyst. You are a defensive cybersecurity assistant. "
        "Analyze only the supplied application/security context. Give clear, practical remediation advice. "
        "Do not provide instructions for unauthorized access, credential theft, persistence, malware, or destructive exploitation. "
        "If asked for offensive steps, redirect to safe validation and defensive testing. "
        "Keep answers concise and structured with: Assessment, Risk, Recommended Fix, Validation Check."
    )
    context = payload.context or {}
    user_input = f"Security context: {context}\n\nUser request: {payload.prompt}"
    try:
        response = client.responses.create(model=model, instructions=system, input=user_input, store=False)
        return {"answer": response.output_text, "model": model}
    except Exception as exc:
        raise HTTPException(502, "AI provider request failed. Check backend logs for details.")
