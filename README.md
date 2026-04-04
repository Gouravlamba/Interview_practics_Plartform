# AI Interview Practice Platform

A full-stack AI-powered interview practice platform built with React + Vite (frontend) and Node.js + Express (backend).

## Features

- **Authentication** — JWT access + refresh tokens, secure password hashing
- **Live Interview** — Real-time AI-powered interview room with Socket.IO
- **AI Assistance** — OpenAI GPT integration with mock fallback (no API key required)
- **Performance Analytics** — Radar charts, trend lines, per-session scoring
- **Interview Setup** — Configure persona, job description, file uploads
- **Role Management** — Create and manage interviewer personas
- **File Uploads** — Resume upload (PDF/TXT/DOC) with validation
- **Code Editor** — Collaborative technical interview code editor
- **Swagger Docs** — Full OpenAPI documentation at `/api-docs`

---

## Quick Start

### Prerequisites

- Node.js 20+
- MongoDB (local or Docker)

### 1. Clone and install

```bash
# Root (frontend)
npm install

# Backend
cd server && npm install
```

### 2. Configure environment

```bash
# Frontend
cp .env.example .env

# Backend
cp server/.env.example server/.env
# Edit server/.env — set MONGODB_URI, JWT_SECRET, JWT_REFRESH_SECRET
# Optionally set OPENAI_API_KEY (mock fallback used if not set)
```

### 3. Run with Docker (recommended)

```bash
docker-compose up -d
```

This starts:
- MongoDB on port `27017`
- Backend server on port `5000`

Then start the frontend:
```bash
npm run dev   # Runs on http://localhost:5173
```

### 4. Run without Docker

Start MongoDB locally, then:

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
npm run dev
```

---

## Project Structure

```
├── src/                        # React frontend (Vite)
│   ├── components/             # Reusable UI components
│   ├── context/AppContext.jsx  # Auth + app state
│   ├── pages/                  # Route pages
│   ├── services/
│   │   ├── api.js              # Axios client with token refresh
│   │   └── socket.js           # Socket.IO client
│   └── data/mockData.js        # Fallback mock data
│
├── server/                     # Node.js + Express backend
│   ├── src/
│   │   ├── config/             # Environment configuration
│   │   ├── controllers/        # Route handlers
│   │   ├── middleware/         # Auth, error, upload, validate
│   │   ├── models/             # Mongoose models
│   │   ├── routes/             # Express routers
│   │   ├── services/           # AI service (OpenAI + mock)
│   │   ├── socket/             # Socket.IO handlers
│   │   ├── swagger.js          # OpenAPI spec
│   │   └── index.js            # Server entry point
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
└── .env.example
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Current user |
| GET/PATCH | `/api/users/me` | Profile management |
| GET/POST | `/api/roles` | List/create roles |
| GET/POST | `/api/sessions` | Interview sessions |
| GET | `/api/sessions/upcoming` | Upcoming interviews |
| GET | `/api/sessions/recordings` | Past recordings |
| GET | `/api/analytics/dashboard` | Dashboard stats |
| GET | `/api/analytics/trend` | Performance trend |
| GET | `/api/analytics/insights` | AI insights |
| POST | `/api/files` | Upload file |
| POST | `/api/ai/insight` | Get AI response |
| GET | `/api-docs` | Swagger UI |
| GET | `/api/health` | Health check |

---

## Socket.IO Events

| Event (emit) | Description |
|--------------|-------------|
| `join-room` | Join interview room |
| `leave-room` | Leave room |
| `send-message` | Send chat message |
| `ai-request` | Request AI response |
| `code-update` | Broadcast code change |
| `code-save` | Persist code to DB |

| Event (listen) | Description |
|----------------|-------------|
| `receive-message` | New chat message |
| `ai-response` | AI reply |
| `ai-thinking` | AI processing indicator |
| `code-sync` | Remote code update |
| `session-history` | Past messages on join |

---

## Environment Variables

### Frontend (`.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:5000` | Backend base URL |

### Backend (`server/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | JWT signing secret |
| `JWT_REFRESH_SECRET` | Yes | Refresh token secret |
| `OPENAI_API_KEY` | No | OpenAI key (mock used if absent) |
| `PORT` | No (5000) | Server port |
| `CLIENT_URL` | No | Frontend URL for CORS |
