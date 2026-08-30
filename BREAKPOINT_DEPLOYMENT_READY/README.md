# BREAKPOINT

Full defensive cybersecurity prototype with the existing Stitch UI connected to a FastAPI + SQLite demo backend.

## Quick start (Windows)
Double-click `START_ALL.bat`. Then open http://127.0.0.1:5173/

## Manual
Backend: `cd backend` → `pip install -r requirements.txt` → `python seed.py` → `uvicorn app.main:app --reload --host 127.0.0.1 --port 8000`
Frontend: `cd frontend` → `python -m http.server 5173 --bind 127.0.0.1`
API docs: http://127.0.0.1:8000/docs

## Flow
Welcome → Dashboard → Scan Results → Vulnerability Details → Attack Path Explorer → Safe Simulation → What-If Analysis → Validation Report.

The security engine uses safe deterministic demo data. It does not execute real-world attacks.


## AI + deployment
See AI_SETUP.md. Backend deployment is prepared with render.yaml; frontend deployment is prepared with frontend/vercel.json. Set the production API URL in frontend/config.js (or replace it during deployment) and set OPENAI_API_KEY only on the backend.

## Validation flow
Open the Before/After screen only after a project exists. If no validation report exists, the screen automatically creates one via `POST /api/projects/{project_id}/validation`; subsequent loads use the latest report endpoint.

## Local startup
Use `START_ALL.bat`. It installs backend dependencies before starting FastAPI, then installs frontend dependencies and starts Vite.
