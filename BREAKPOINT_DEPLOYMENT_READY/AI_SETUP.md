# BREAKPOINT AI setup

BREAKPOINT now includes a defensive AI Security Analyst backed by the OpenAI Responses API. The API key stays on the backend and is never placed in frontend code.

1. Copy `backend/.env.example` to `backend/.env`.
2. Put your OpenAI API key in `OPENAI_API_KEY`.
3. Keep `OPENAI_MODEL=gpt-5.6-luna` for a cost-sensitive model, or change it to another model available to your project.
4. Restart FastAPI.
5. Use the `AI ANALYST` button in the UI.

For deployment, set the same variables as protected environment variables in the backend host. Never commit `.env` or the API key.
