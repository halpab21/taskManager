# Task Manager

This project contains a Spring Boot backend and a Vite+React frontend for managing simple tasks in-memory.

Backend
- Location: `backend/`
- Run: `mvn spring-boot:run`
- API base: `http://localhost:8080/api/tasks`

Frontend
- Location: `frontend/`
- Install deps: `npm install`
- Dev server: `npm run dev` (runs on http://localhost:5173 and proxies `/api` to the backend)

Notes
- No database: data is stored in-memory in the backend and resets on restart.
