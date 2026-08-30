# BREAKPOINT Deployment

## Architecture
- Frontend: Vercel (`frontend/`)
- Backend: Render (`backend/`)
- Database: managed PostgreSQL

## Render environment variables
Set these in Render before deploying:
- `DATABASE_URL` = your managed PostgreSQL connection string
- `AUTH_SECRET` = long random secret (Render can generate it)
- `CORS_ORIGINS` = exact Vercel URL, e.g. `https://your-app.vercel.app`
- `OPENAI_API_KEY` = optional, only if AI analysis is enabled
- `OPENAI_MODEL` = `gpt-5.6-luna`

Do not use `CORS_ORIGINS=*` in production.

## Vercel
Set the project Root Directory to `frontend`.
Before deployment, edit `frontend/config.js` and replace:
`https://YOUR-RENDER-SERVICE.onrender.com/api`
with the actual Render API URL.

The frontend stores the JWT in localStorage and sends it as a Bearer token. The backend now enforces ownership on projects, scans, vulnerabilities, attack paths, simulations, what-if analysis, validation reports, and AI endpoints.

## Local development
Backend:
```bash
cd backend
python -m venv .venv
# activate the environment
pip install -r requirements.txt
set AUTH_SECRET=local-development-secret
uvicorn app.main:app --reload --port 8000
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

For local frontend use, set `window.BREAKPOINT_API_URL` in `frontend/config.js` to `http://127.0.0.1:8000/api`.

## Optional demo seed
```bash
DEMO_PASSWORD="a-long-demo-password" python seed.py
```
Never commit demo credentials.
