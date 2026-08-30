import os
from fastapi import APIRouter, HTTPException, Depends
from google import genai
from google.genai import types
from ..models import User
from .auth import current_user
from pydantic import BaseModel, Field

router = APIRouter(prefix="/api/ai", tags=["ai"])

class AIRequest(BaseModel):
    prompt: str = Field(min_length=1, max_length=6000)
    context: dict = Field(default_factory=dict)

@router.get("/status")
def ai_status(user: User = Depends(current_user)):
    return {
        "configured": bool(os.getenv("GEMINI_API_KEY")), 
        "model": os.getenv("GEMINI_MODEL", "gemini-3.6-flash")
    }

@router.post("/analyze")
def analyze(payload: AIRequest, user: User = Depends(current_user)):
    key = os.getenv("GEMINI_API_KEY")
    if not key:
        raise HTTPException(503, "AI is not configured. Add GEMINI_API_KEY to the backend environment.")
    
    # Initialize the Gemini Client
    client = genai.Client(api_key=key)
    model = os.getenv("GEMINI_MODEL", "gemini-3.6-flash")
       system_instruction = (
        "You are BREAKPOINT AI Security Analyst. You are a defensive cybersecurity assistant. "
        "Analyze only the supplied application/security context. Give clear, practical remediation advice. "
        "Do not provide instructions for unauthorized access, credential theft, persistence, malware, or destructive exploitation. "
        "If asked for offensive steps, redirect to safe validation and defensive testing. "
        "Write for someone who is NOT a security expert: avoid jargon and acronyms (like IDOR, BOLA, CVE) unless you immediately explain what they mean in plain words. "
        "Use short sentences and everyday language, as if explaining to a product manager, not another engineer. "
        "Keep answers concise and structured with: What's wrong (plain language), Why it matters (real-world consequence), How to fix it (simple steps), How to check it's fixed."
    )
    
    context = payload.context or {}
    user_input = f"Security context: {context}\n\nUser request: {payload.prompt}"
    
    try:
        response = client.models.generate_content(
            model=model,
            contents=user_input,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
            ),
        )
        return {"answer": response.text, "model": model}
    except Exception as exc:
        print(f"GEMINI ERROR: {exc}")
        raise HTTPException(502, "AI provider request failed. Check backend logs for details.")
