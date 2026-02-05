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

## 🛠️ Local Development Setup

There are two ways to run the application locally:
1. **Option A**: Using Docker Compose (Easiest - Everything in containers)
2. **Option B**: Manual setup (Backend + Frontend separately with local database)

---

### Option A: Using Docker Compose (Recommended for Local Development)

This method runs the entire stack (database, backend, frontend) in containers.

**Prerequisites:**
- [Docker Desktop](https://docs.docker.com/get-docker/) installed and running

**Steps:**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/halpab21/taskManager.git
   cd taskManager
   ```

2. **Build and start all services:**
   ```bash
   docker-compose up --build
   ```

   This will:
   - Start PostgreSQL database on port `5432`
   - Build and start the application (frontend + backend) on port `8080`

3. **Access the application:**
   - Application: http://localhost:8080
   - Backend API: http://localhost:8080/api

4. **Stop the application:**
   ```bash
   docker-compose down
   ```

5. **Stop and remove all data (including database):**
   ```bash
   docker-compose down -v
   ```

---

### Option B: Manual Setup (For Active Development)

This method is better when you're actively developing and want faster feedback loops.

**Prerequisites:**
- Java 17 or higher ([Download OpenJDK](https://adoptium.net/))
- Maven 3.9+ (usually bundled with Java IDEs)
- Node.js 20+ ([Download Node.js](https://nodejs.org/))
- Docker (for database only)

**Step 1: Start PostgreSQL Database**

Use Docker to run only the database:
```bash
docker-compose up db
```

The database will be available at `localhost:5432` with:
- Database: `taskmanager`
- Username: `admin`
- Password: `admin`

**Step 2: Start the Backend (Spring Boot)**

Open a new terminal window:
```bash
cd backend
mvn spring-boot:run
```

The backend API will start on http://localhost:8080

**Step 3: Start the Frontend (React + Vite)**

Open another terminal window:
```bash
cd frontend
npm install          # Only needed first time
npm run dev
```

The frontend will start on http://localhost:5173

**Step 4: Access the Application**

Open your browser and navigate to http://localhost:5173

---

### 🔧 Troubleshooting

**Problem: Port already in use**
- Check if another service is using the port:
  ```bash
  # On Linux/Mac
  lsof -i :8080
  lsof -i :5173
  lsof -i :5432
  
  # On Windows
  netstat -ano | findstr :8080
  netstat -ano | findstr :5173
  netstat -ano | findstr :5432
  ```
- Stop the conflicting service or change the port in the configuration

**Problem: Database connection refused**
- Ensure PostgreSQL container is running: `docker ps`
- Check database logs: `docker-compose logs db`
- Verify connection details in `backend/src/main/resources/application.properties`

**Problem: Frontend can't connect to backend**
- Ensure backend is running on http://localhost:8080
- Check for CORS errors in browser console
- Verify API endpoint in frontend configuration

**Problem: Maven build fails**
- Clean and rebuild: `mvn clean install`
- Check Java version: `java -version` (should be 17+)

**Problem: npm install fails**
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then run `npm install` again
- Check Node.js version: `node -v` (should be 20+)

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
