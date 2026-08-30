import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .routes import projects, scans, vulnerabilities, analysis, ai, auth
from . import models

Base.metadata.create_all(bind=engine)
app=FastAPI(title='BREAKPOINT API',version='1.1.0',description='Defensive cybersecurity analysis backend for the BREAKPOINT prototype.')
origins=[o.strip() for o in os.getenv('CORS_ORIGINS','http://localhost:5173').split(',') if o.strip() and o.strip() != '*']
app.add_middleware(CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"])
app.include_router(projects.router); app.include_router(scans.router); app.include_router(vulnerabilities.router); app.include_router(analysis.router)
app.include_router(ai.router); app.include_router(auth.router)
@app.middleware('http')
async def security_headers(request, call_next):
    response = await call_next(request)
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    response.headers['Permissions-Policy'] = 'camera=(), microphone=(), geolocation=()'
    return response

@app.get('/health')
def health(): return {'status':'ok','service':'breakpoint-api'}
