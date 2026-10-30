# CareerCoach AI — Backend API & Database (Phase 3)

Backend server, SQLite database, and session-based authentication system for **CareerCoach AI**, an engineering placement preparation platform.

---

## Tech Stack
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** SQLite (persisted locally via `sqlite3` driver)
- **Sessions:** `express-session` with `connect-sqlite3` session store
- **Security:** `bcrypt` (12 salt rounds), `helmet`, strict CORS, `express-validator`

---

## Database Architecture
The SQLite database file is stored at `backend/data/careercoach.db` (and `backend/data/sessions.db` for session state).
*Note: The initialization script never deletes existing database files.*

### 9 Relational Tables:
1. **`users`**: Secure account credentials (`id`, `email`, `password_hash`, `created_at`, `updated_at`).
2. **`student_profiles`**: Comprehensive academic & placement personalization (`user_id`, `full_name`, `college`, `degree`, `department_id`, `department_name`, `current_year`, `graduation_year`, `skills`, `target_role_id`, `target_role_name`, `difficulty_level`, `bio`, `linkedin_url`, `github_url`, `avatar_initials`).
3. **`career_roles`**: Reference catalog of 23 engineering roles with recommended branches and core skills.
4. **`questions`**: Question Bank across HR, behavioral, aptitude, programming/DSA, web dev, databases, systems, and branch-specific technical domains (Mechanical, Biomedical, ECE, EEE, Civil, AI&DS).
5. **`interview_sessions`**: Placement mock interviews (`id`, `user_id`, `role_id`, `difficulty`, `interview_type`, `total_questions`, `questions_list`, `status`, `score`, `interview_mode` ['video'|'voice'|'text'], `feedback_mode` ['immediate'|'end_of_interview'], `started_at`, `completed_at`).
6. **`interview_answers`**: Student answers and structured AI evaluations per question (`id`, `session_id`, `user_id`, `question_id`, `question_text`, `user_answer`, `score`, `verdict`, `what_did_well`, `missing_points`, `suggested_answer`, `improvement_tip`, `encouragement`, `evaluation_source`, `input_mode` ['voice'|'voice_edited'|'text']).
7. **`progress_records`**: Historical metrics tracking (`user_id`, `metric_key`, `metric_value`, `recorded_at`).
8. **`roadmap_tasks`**: Personalized weekly roadmap tasks (`id`, `user_id`, `week_number`, `week_label`, `task_title`, `task_type`, `is_done`).
9. **`communication_submissions`**: Phase 5 communication practice submissions (`id`, `user_id`, `activity_id`, `activity_title`, `prompt_text`, `user_response`, `score`, `grammar_score`, `clarity_score`, `vocab_score`, `tone_score`, `conciseness_score`, `strengths`, `improvements`, `revised_version`, `revision_rationale`, `follow_up_exercise`, `encouragement`, `word_count`, `reading_time_sec`).

---

## Installation & Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default `.env` configuration:
```env
PORT=5000
NODE_ENV=development
SESSION_SECRET=dev_secret_key_change_in_production_min32chars
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
DB_PATH=data/careercoach.db
```

### 3. Initialize Database & Seed Reference Data
```bash
npm run db:init
```
This automatically runs table migrations and seeds reference roles and default test accounts if not already present.

### 4. Start Server
- **Development (with hot-reload):**
  ```bash
  npm run dev
  ```
- **Production start:**
  ```bash
  npm start
  ```

Server will be running at `http://localhost:5000`.

---

## API Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Health check & uptime timestamp |
| `POST` | `/api/auth/register` | Public | Create student account & start session |
| `POST` | `/api/auth/login` | Public | Authenticate user & regenerate session |
| `POST` | `/api/auth/logout` | Public | Invalidate session & clear cookie |
| `GET` | `/api/auth/me` | Authenticated | Fetch current authenticated session user |
| `GET` | `/api/departments` | Public | List of engineering departments |
| `GET` | `/api/career-roles` | Public | 23 career roles with branch alignments |
| `GET` | `/api/profile` | Authenticated | Fetch current student profile |
| `PUT` | `/api/profile` | Authenticated | Update student profile and skills |
| `PATCH` | `/api/profile/department` | Authenticated | Update active branch |
| `PATCH` | `/api/profile/role` | Authenticated | Update active target role |
| `GET` | `/api/questions` | Public | List & filter questions (category, type, dept, diff, search) |
| `GET` | `/api/questions/categories` | Public | List question categories with counts |
| `GET` | `/api/questions/:id` | Public | Get single question details with reference answer & rubric |
| `GET` | `/api/communication/activities` | Authenticated | List all 10 communication practice modules |
| `GET` | `/api/communication/activities/:id` | Authenticated | Get activity guidelines, prompt, and sample draft |
| `POST` | `/api/communication/evaluate` | Authenticated | Assess draft on grammar, clarity, vocabulary, tone, conciseness |
| `POST` | `/api/communication/submit` | Authenticated | Evaluate and persist activity attempt to student profile |
| `GET` | `/api/communication/history` | Authenticated | User's past communication attempts and progression |
| `GET` | `/api/communication/stats` | Authenticated | Summary analytics and chronological score trend |
| `GET` | `/api/dashboard` | Authenticated | Dashboard summary & stats |
| `POST` | `/api/interview/sessions` | Authenticated | Start configured interview session (role, type, diff, count) |
| `GET` | `/api/interview/sessions` | Authenticated | List student's past interview sessions |
| `GET` | `/api/interview/sessions/:id` | Authenticated | Get interview session details and answers |
| `POST` | `/api/interview/sessions/:id/evaluate` | Authenticated | Evaluate answer via AI/rubric with retry support |
| `POST` | `/api/interview/sessions/:id/answers` | Authenticated | Commit answer or record skipped question |
| `PATCH` | `/api/interview/sessions/:id/complete` | Authenticated | Conclude session & compute aggregate performance score |
| `GET` | `/api/roadmap` | Authenticated | User's personalized roadmap tasks |
| `POST` | `/api/roadmap/tasks` | Authenticated | Add a custom roadmap task |
| `PATCH` | `/api/roadmap/tasks/:id/toggle` | Authenticated | Toggle task completion |
| `DELETE` | `/api/roadmap/tasks/:id` | Authenticated | Delete task (user-scoped) |

---

## Running the Automated Test Suite

Run all automated test suites (Phase 3 + Phase 4 + Phase 5 + Phase 6):
```bash
npm test
```
Or run individual suites:
- **Phase 3 (Auth, Session, Isolation):** `node test-phase3.js`
- **Phase 4 (Question Bank, AI Evaluation, Interview Flow):** `node test-phase4.js`
- **Phase 5 (Communication Coach, Metrics, History):** `node test-phase5.js`
- **Phase 6 (Voice & Video Mock Interview, STT/TTS, Privacy):** `node test-phase6.js`
