# Task Manager

A full-stack task management application with React frontend and Spring Boot backend.

## Features

- ✅ Create, complete, and delete tasks
- 🎯 Priority levels: ASAP, Soon, Sometime
- 📅 Set deadlines for tasks
- 📆 Calendar view to see tasks by date
- 🎨 Beautiful dark purple theme

---

## 🚀 Quick Start (Docker)

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) installed

### One-Command Start

**Step 1:** Download the docker-compose file
```bash
curl -O https://raw.githubusercontent.com/halpab21/taskManager/main/docker-compose.prod.yml
```

**Step 2:** Start the application
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Open the App

Navigate to **http://localhost:8080** in your browser.

### Stop the Application

```bash
docker-compose -f docker-compose.prod.yml down
```

### Remove All Data

```bash
docker-compose -f docker-compose.prod.yml down -v
```

---

## 🛠️ Development Setup

### Backend
- Location: `backend/`
- Requirements: Java 17, Maven
- Run: `mvn spring-boot:run`
- API: `http://localhost:8080`

### Frontend
- Location: `frontend/`
- Requirements: Node.js 20+
- Install: `npm install`
- Run: `npm run dev`
- URL: `http://localhost:5173`

### Database
Start PostgreSQL with Docker:
```bash
docker-compose up db
```

---

## 📁 Project Structure

```
├── backend/          # Spring Boot API
├── frontend/         # React + Vite frontend
├── docker-compose.yml        # Development compose
├── docker-compose.prod.yml   # Production compose (for users)
└── Dockerfile        # Multi-stage build
```

---

## 🧪 Testing

### Backend Tests
```bash
cd backend && mvn test
```

### E2E Tests (Cypress)
```bash
cd frontend && npx cypress run
```

---

## 📝 License

MIT
