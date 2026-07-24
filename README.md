# ⚡ PromptSpark

**A full-stack SaaS platform to create, test, version, and analyze AI prompts.**

Build your prompt library, run prompts live against an AI model, A/B test variants, and track token cost — all in one clean, modern dashboard.

[Live Demo](#) · [API Documentation](./API_DOCS.md) · [Report a Bug](#)

<div align="center">

<br>

[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)](https://www.chartjs.org/)
[![Groq](https://img.shields.io/badge/Groq_API-F55036?style=for-the-badge&logo=lightning&logoColor=white)](https://groq.com/)
[![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)
[![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)](https://git-scm.com/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/)
[![Prompt Engineering](https://img.shields.io/badge/Prompt%20Engineering-5B3A8C?style=for-the-badge&logo=sparkles&logoColor=white)](https://www.promptingguide.ai/)
</div>

---

## 📖 Overview

PromptSpark is a complete prompt-engineering workspace — the kind of internal tool an AI-focused team would actually use. It lets a user register, build a personal library of prompts, edit them with full version history, run them live against a large language model, compare two variants head-to-head, and track exactly how much every AI call costs.

---

## ✨ Features

| | Feature | Description |
|---|---|---|
| 🔐 | **Authentication** | Secure registration and login with JWT tokens and bcrypt password hashing |
| 📝 | **Prompt Library** | Full CRUD — create, edit, and delete prompts, organized by category |
| 🔍 | **Search & Filtering** | Live, debounced search by title plus category filtering |
| 🕒 | **Version Control** | Every edit auto-snapshots the previous version, with one-click restore |
| 🤖 | **AI Playground** | Run any prompt live against the Groq API and see the output instantly |
| ⚖️ | **A/B Testing** | Run two prompt variants in parallel and compare results side by side |
| 📊 | **Analytics Dashboard** | Visual charts of daily cost and token usage, powered by MongoDB aggregation |
| 💰 | **Cost Tracking** | Every AI call is logged with token counts and calculated cost in real time |
| 🛡️ | **Security Hardened** | Helmet, rate limiting, and input validation on every endpoint |
| ✅ | **Automated Testing** | Jest + Supertest test suite covering the authentication flow |
| 📱 | **Responsive UI** | Fully usable across desktop, tablet, and mobile |
| 📚 | **API Documentation** | A complete written reference of every backend endpoint |

---

## 🧰 Tech Stack

**Frontend** — HTML5, CSS3, JavaScript, Bootstrap, Chart.js
**Backend** — Node.js, Express.js
**Database** — MongoDB Atlas, Mongoose
**Authentication** — JWT, bcrypt.js
**AI Provider** — Groq API (built on a swappable provider architecture — OpenAI, Anthropic, and Hugging Face can be added as new provider files)
**Security** — Helmet, express-rate-limit, express-validator
**Testing** — Jest, Supertest, mongodb-memory-server
**Deployment** — Render (backend), Vercel (frontend), MongoDB Atlas (database)
**Version Control** — Git, GitHub

---

## 🏗️ System Architecture

```mermaid
flowchart LR
    A["🖥️ Browser<br/>Frontend (Vercel)"] -- "REST API calls<br/>JWT authenticated" --> B["⚙️ Express Backend<br/>(Render)"]
    B -- "Mongoose queries" --> C[("🗄️ MongoDB Atlas")]
    B -- "Prompt execution" --> D["🤖 Groq API"]
    B -- "Logs usage" --> C
    D -- "AI output + token usage" --> B
    B -- "JSON response" --> A
```

## 🔑 Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant DB as MongoDB

    U->>F: Enter email & password
    F->>B: POST /api/auth/login
    B->>DB: Find user by email
    DB-->>B: User record (hashed password)
    B->>B: Compare password with bcrypt
    B->>B: Sign JWT token
    B-->>F: { token, user }
    F->>F: Store token in localStorage
    F-->>U: Redirect to dashboard
```

## ✍️ Prompt Versioning Flow

```mermaid
flowchart TD
    A["User edits a prompt"] --> B{"Prompt already exists?"}
    B -- Yes --> C["Save current state as<br/>a new PromptVersion"]
    C --> D["Apply the new changes<br/>to the Prompt document"]
    B -- No --> E["Create new Prompt document"]
    D --> F["Return updated prompt"]
    E --> F
    F --> G["Version history available<br/>for one-click restore"]
```

## ⚖️ A/B Testing Flow

```mermaid
flowchart LR
    A["User submits<br/>Variant A + Variant B"] --> B["Backend generates<br/>shared abTestGroup ID"]
    B --> C["Run Variant A<br/>via Groq"]
    B --> D["Run Variant B<br/>via Groq"]
    C --> E["Log run + cost<br/>to MongoDB"]
    D --> F["Log run + cost<br/>to MongoDB"]
    E --> G["Return both results<br/>to frontend"]
    F --> G
    G --> H["Side-by-side<br/>comparison UI"]
```

## 🧩 AI Provider Architecture

```mermaid
flowchart TD
    A["/api/ai/run<br/>route"] --> B{"Provider registry"}
    B --> C["Groq Provider<br/>(active)"]
    B -.-> D["OpenAI Provider<br/>(future)"]
    B -.-> E["Anthropic Provider<br/>(future)"]
    B -.-> F["Hugging Face Provider<br/>(future)"]
    C --> G["Same output shape:<br/>output, usage, model"]
    D -.-> G
    E -.-> G
    F -.-> G
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js and npm installed
- A MongoDB Atlas account (free tier works)
- A Groq API key from [console.groq.com](https://console.groq.com/keys)

### Installation

```bash
# Clone the repository
git clone https://github.com/Stars8575/PROMPTSPARK-CapstoneProject
cd promptspark

# Install backend dependencies
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret_key
GROQ_API_KEY=your_groq_api_key
```

### Run locally

```bash
# Start the backend
cd backend
npm run dev
```

Open `frontend/index.html` with a live server (e.g. the VS Code Live Server extension) to view the app in your browser.

### Run tests

```bash
cd backend
npm test
```

---

## 📡 API Reference

Full endpoint documentation — request/response formats, auth requirements, and rate limits — is available in [API_DOCS.md](./API_DOCS.md).

---

## ☁️ Deployment

| Service | Hosts |
|---|---|
| **Vercel** | Static frontend, auto-deployed on push to `main` |
| **Render** | Express backend API |
| **MongoDB Atlas** | Cloud database |

---

## 🗺️ Roadmap

- [ ] Refresh-token-based authentication
- [ ] Additional AI providers (OpenAI, Anthropic, Hugging Face)
- [ ] Pagination for large prompt libraries
- [ ] Real-time streaming AI responses

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE) — feel free to use, modify, and build on it.

---

## 👩‍💻 Author

**Anushka Tuli**

GitHub: https://github.com/Stars8575
