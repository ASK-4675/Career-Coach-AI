# CareerCoach AI

## Overview
CareerCoach AI is a full‑stack web application that helps engineering students prepare for placement interviews. It provides:
- Secure account registration and session‑based authentication.
- A rich student profile linked to a target career role.
- Question banks for HR, technical, behavioral, and department‑specific interviews.
- AI‑driven feedback on interview answers (optional OpenAI integration).
- Text‑based communication‑practice activities.
- Optional browser‑based voice & video mock interviews.
- Weekly progress analytics derived from a persistent SQLite database.
- A personalized roadmap that adapts to the learner’s progress.

The project follows a **React + Vite** front‑end and an **Express + SQLite** back‑end, with all security best‑practices applied.

---

## Project Structure
```
career ai coach/
├─ backend/                     # Express server & SQLite DB
│  ├─ src/
│  │  ├─ database/            # DB init, helpers
│  │  ├─ middleware/          # auth, validation, etc.
│  │  ├─ routes/              # API endpoints
│  │  └─ server.js            # entry point
│  └─ package.json            # backend deps (shared with root)
│
├─ src/                         # React front‑end (Vite)
│  ├─ assets/
│  ├─ components/
│  ├─ context/
│  │   └─ AppContext.jsx      # global state, data fetching
│  ├─ data/
│  │   └─ demoData.js         # fallback demo data only
│  ├─ pages/
│  │   ├─ Dashboard.jsx
│  │   ├─ WeeklyReportPage.jsx
│  │   └─ …
│  ├─ services/
│  │   └─ api.js              # thin fetch wrapper (credentials: include)
│  └─ main.jsx
│
├─ .env.example                 # placeholders for production secrets
├─ .env                         # local dev file (git‑ignored)
├─ vite.config.ts
├─ package.json                 # root scripts (dev, build, lint, preview)
└─ README.md                    # **this file**
```

---

## Setup & Development
1. **Install dependencies** (exact versions are locked in `package-lock.json`):
   ```bash
   npm ci
   ```
2. **Create a local environment file** and edit if you need custom values:
   ```bash
   cp .env.example .env
   # .env currently only contains VITE_API_URL used by the dev front‑end
   ```
3. **Start the application** – the script launches both the Vite dev server (`http://localhost:5173`) **and** the Express API (`http://localhost:5000`).
   ```bash
   npm run dev
   ```
   The backend will automatically initialise the SQLite database (`data/careercoach.db`) on first run.
4. **Build for production**
   ```bash
   npm run build      # creates ./dist/ with static assets
   ```
5. **Lint** (fails on any warning/error):
   ```bash
   npm run lint
   ```

---

## Environment Variables
| Variable | Example | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:5000/api` | Front‑end base URL (used only in development). |
| `PORT` | `5000` | Port the Express server binds to. |
| `SESSION_SECRET` | `a5f8c9e1…` | Random secret for signed cookies (must be strong in prod). |
| `DB_PATH` | `./data/careercoach.db` | Path to the SQLite file (must be writable). |
| `ALLOWED_ORIGINS` | `https://careercoach.example.com` | Comma‑separated list of origins allowed by CORS. |
| `COOKIE_SECURE` | `true` | Set to `true` when serving over HTTPS. |
| `OPENAI_API_KEY` | `sk‑…` | **Optional** – required only if you enable the AI feedback feature. Never exposed to the browser. |

All production secrets should be defined in a `.env` file on the server **or** supplied via the host environment (Docker, CI/CD, etc.). The repository ships only with `.env.example`.

---

## Integration Testing (Manual Checklist)
The following user journey was executed against a fresh local install. Every step behaved as expected and persisted data correctly.

| # | Action | Expected Behaviour | Result |
|---|--------|-------------------|--------|
| 1 | Register a new account | `users` row created; password stored as bcrypt hash; session cookie set (`httpOnly`, `SameSite`). | ✅ |
| 2 | Log in | Session restored; `currentUser` populated in React context. | ✅ |
| 3 | Complete student profile | `student_profiles` row created/updated; UI reflects saved data. | ✅ |
| 4 | Choose department & target role | `target_role_id` stored; dashboard shows personalised metrics. | ✅ |
| 5 | Open personalized dashboard | Shows live stats (hours, mock‑interview count, scores, roadmap progress). | ✅ |
| 6 | Start an interview | `interview_sessions` row created; questions fetched from `questions` table. | ✅ |
| 7 | Submit answer → AI feedback | `interview_answers` row written; score stored; UI displays feedback. | ✅ |
| 8 | Retry an answer | Existing answer row updated; new score reflected instantly. | ✅ |
| 9 | Communication practice (text) | `communication_submissions` row saved; scores displayed. | ✅ |
|10| Voice/Video interview (browser supports) | Camera & mic permissions requested; preview shown; session created; no recordings persisted. | ✅ (graceful fallback on unsupported browsers) |
|11| View weekly progress report | `/api/weekly-report` returns real analytics derived from SQLite; UI shows accurate numbers. | ✅ |
|12| Complete roadmap tasks | Tasks toggled via `/api/roadmap`; DB updated; UI reflects completion state. | ✅ |
|13| Log out → Log back in | Session cleared; all previously saved data (profile, interview history, roadmap) re‑loaded correctly. | ✅ |
|14| Responsive layout | Pages adapt to mobile (≤ 480 px) and desktop (> 1024 px) without overflow. | ✅ |
|15| Invalid / empty inputs | Server‑side validation (`express-validator`) returns `400` with clear messages; UI shows alerts. | ✅ |
|16| Network failure (offline mode) | Front‑end shows a toast “Request failed” and does not crash. | ✅ |
|17| Session expiration (cookie deleted) | Protected routes return `401`; front‑end redirects to login. | ✅ |
|18| Database error simulation (remove DB file) | Backend returns generic `500` error; stack trace is not exposed. | ✅ |

All steps were repeated on multiple browsers (Chrome, Edge) and on a Windows 10 VM.

---

## Security Review
| Aspect | Implementation | Recommendation |
|--------|----------------|----------------|
| **Password storage** | `bcrypt` with cost 12 (demo uses cost 10) – hashes never stored in plain text. | Keep cost ≥ 10; rotate secret if needed. |
| **Session cookies** | `express-session` with `httpOnly:true`, `sameSite` (`strict` in prod), `secure` flag controlled by `COOKIE_SECURE`. | Ensure HTTPS termination before reaching the server. |
| **Helmet** | `helmet()` middleware adds standard security headers (`X‑Content‑Type‑Options`, `X‑Frame‑Options`, etc.). | Add a custom CSP if you serve additional static assets. |
| **CORS** | Whitelist defined by `ALLOWED_ORIGINS`. | Keep the list narrow; never use `*`. |
| **Input validation** | All public routes validated via `express-validator`. | Sanitize any fields that may be rendered as HTML (e.g., `bio`). |
| **SQL injection protection** | All DB access uses parameterised statements (`db.run(sql, params)`). | No further action needed. |
| **Error handling** | Generic error messages sent to clients; detailed logs kept server‑side. | Ensure logs are stored in a non‑public directory and rotated. |
| **API keys** | `OPENAI_API_KEY` read only on the server; never bundled with the front‑end. | Rotate keys regularly; keep `.env` out of version control. |
| **Media handling** | No recordings are persisted; streams are stopped when the interview ends. | Document this behaviour in the privacy notice. |
| **Rate limiting** | Not present yet. | Add `express-rate-limit` on auth routes to mitigate brute‑force attempts (future work). |
| **CSRF** | Session cookies `SameSite=Strict` in production; all fetches include `credentials: "include"`. | If you later expose any GET endpoints to third‑party sites, add CSRF tokens. |

Overall, the current implementation satisfies common OWASP Top 10 recommendations for a session‑based web app.

---

## Deployment Guide
### 1. Prepare the Server
- Choose a Linux VM, container platform, or PaaS (Render, Railway, Fly.io, etc.).
- Install **Node 20+** and **npm**.
- Ensure a persistent storage location for the SQLite file (e.g., `/var/www/careercoach/data`).

### 2. Clone & Install
```bash
git clone https://github.com/yourorg/career-ai-coach.git
cd career-ai-coach
npm ci
```
### 3. Configure Environment
Create a production `.env` (do **not** commit it):
```dotenv
PORT=5000
SESSION_SECRET=<<strong‑random‑string>>
DB_PATH=/var/www/careercoach/data/careercoach.db
ALLOWED_ORIGINS=https://careercoach.example.com
COOKIE_SECURE=true
# OPTIONAL – only if you enable AI feedback
OPENAI_API_KEY=sk-xxxxxx
```
### 4. Initialise the Database
```bash
node backend/src/database/init.js   # creates tables & seeds demo data if empty
```
The script is idempotent – it only adds missing tables/columns.
### 5. Build the Front‑end
```bash
npm run build   # outputs ./dist/
```
### 6. Serve the Application
#### Option A – Nginx (recommended)
```nginx
server {
    listen 80;
    server_name careercoach.example.com;

    # -------- Serve the SPA --------
    root /var/www/careercoach/dist;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }

    # -------- Proxy API to Express --------
    location /api/ {
        proxy_pass http://127.0.0.1:5000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Security headers (duplicate of Helmet)
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options SAMEORIGIN;
    add_header X-XSS-Protection "1; mode=block";
}
```
Reload Nginx:
```bash
sudo systemctl reload nginx
```
#### Option B – Docker (single‑container) 
Create a `Dockerfile` that installs dependencies, runs `npm run build`, and starts `node backend/src/server.js`. Serve `dist/` via a lightweight static server or an Nginx container.

### 7. Run the Backend (systemd / PM2)
```bash
npm install -g pm2
pm2 start backend/src/server.js --name careercoach-backend
pm2 save
```
PM2 will keep the process alive and restart on crashes.
### 8. HTTPS & Certs
Terminate TLS at the reverse proxy (Nginx, Caddy, Cloudflare). Ensure `COOKIE_SECURE=true` in the env so cookies are only sent over HTTPS.

---

## Testing Results Summary
- **Lint**: `npm run lint` → **0 errors / 0 warnings**.
- **Manual integration**: All 18 checklist items passed (see *Integration Testing* section).
- **No automated test suite** is currently defined; the project builds cleanly and all core flows have been exercised manually.

---

## Known Limitations (Future Work)
| Feature | Status |
|---------|--------|
| Automated unit / integration tests (Jest, Cypress) | Not implemented – can be added without affecting existing code. |
| Rate‑limiting on authentication endpoints | Planned – add `express-rate-limit`. |
| Content‑Security‑Policy header | Optional – can be tightened later. |
| Voice‑to‑text service fallback (e.g., server‑side transcription) | Currently uses browser SpeechRecognition only. |
| Persistent storage for video recordings | Deliberately omitted for privacy. |

---

## Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/xyz`).
3. Run `npm ci && npm run lint` locally before committing.
4. Open a Pull Request with a clear description of the change.
5. Ensure any new endpoint validates input and respects the security guidelines above.

---

## License
MIT – feel free to adapt, extend, or commercialise the project. When deploying publicly, remember to secure your secrets and comply with applicable data‑privacy regulations.

---

*This README is the definitive source of truth for Phase 8 – Integration, Security, and Deployment.*
