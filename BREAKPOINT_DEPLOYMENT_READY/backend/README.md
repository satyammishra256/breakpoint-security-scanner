# BREAKPOINT Backend

FastAPI + SQLite backend for the BREAKPOINT defensive cybersecurity prototype.

## Run

```bash
cd backend
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
python seed.py
uvicorn app.main:app --reload
```

API docs: http://127.0.0.1:8000/docs
Health: http://127.0.0.1:8000/health

The scan/simulation logic is intentionally demo-safe. It does not perform real attacks against target systems.
