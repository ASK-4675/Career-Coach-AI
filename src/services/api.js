/**
 * CareerCoach AI - API client
 * All requests go to the Express backend at /api.
 * Credentials (session cookies) are always sent.
 */

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(method, endpoint, body = null) {
  const opts = {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json" }
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE}${endpoint}`, opts);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.status = res.status;
    err.details = data.details || null;
    throw err;
  }
  return data;
}

// ── Auth ──────────────────────────────────────────────────────
export const authApi = {
  register: (payload) => request("POST", "/auth/register", payload),
  login: (email, password) => request("POST", "/auth/login", { email, password }),
  logout: () => request("POST", "/auth/logout"),
  me: () => request("GET", "/auth/me")
};

// ── Profile ───────────────────────────────────────────────────
export const profileApi = {
  get: () => request("GET", "/profile"),
  update: (data) => request("PUT", "/profile", data),
  setDepartment: (department_id, department_name) =>
    request("PATCH", "/profile/department", { department_id, department_name }),
  setRole: (target_role_id, target_role_name) =>
    request("PATCH", "/profile/role", { target_role_id, target_role_name })
};

// ── Reference data ────────────────────────────────────────────
export const referenceApi = {
  getDepartments: () => request("GET", "/departments"),
  getCareerRoles: () => request("GET", "/career-roles")
};

// ── Question Bank ─────────────────────────────────────────────
export const questionBankApi = {
  getQuestions: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "" && v !== "All") {
        query.append(k, v);
      }
    });
    const qs = query.toString();
    return request("GET", `/questions${qs ? `?${qs}` : ""}`);
  },
  getCategories: () => request("GET", "/questions/categories"),
  getQuestion: (id) => request("GET", `/questions/${id}`)
};

// ── Dashboard ─────────────────────────────────────────────────
export const dashboardApi = {
  getSummary: () => request("GET", "/dashboard")
};

// ── Weekly Report ───────────────────────────────────────
export const weeklyReportApi = {
  getSummary: () => request("GET", "/weekly-report")
};

// ── Interview ─────────────────────────────────────────────────
export const interviewApi = {
  startSession: (
    role_id,
    difficulty = "medium",
    interview_type = "mixed",
    question_count = 3,
    interview_mode = "video",
    feedback_mode = "immediate"
  ) =>
    request("POST", "/interview/sessions", {
      role_id,
      difficulty,
      interview_type,
      question_count,
      interview_mode,
      feedback_mode
    }),
  getSessions: () => request("GET", "/interview/sessions"),
  getSession: (id) => request("GET", `/interview/sessions/${id}`),
  evaluateAnswer: (sessionId, payload) =>
    request("POST", `/interview/sessions/${sessionId}/evaluate`, payload),
  saveAnswer: (sessionId, payload) =>
    request("POST", `/interview/sessions/${sessionId}/answers`, payload),
  completeSession: (sessionId, payload) =>
    request("PATCH", `/interview/sessions/${sessionId}/complete`, payload)
};

// ── Roadmap ───────────────────────────────────────────────────
export const roadmapApi = {
  get: () => request("GET", "/roadmap"),
  addTask: (task) => request("POST", "/roadmap/tasks", task),
  toggleTask: (id) => request("PATCH", `/roadmap/tasks/${id}/toggle`),
  deleteTask: (id) => request("DELETE", `/roadmap/tasks/${id}`)
};

// ── Communication Coach ───────────────────────────────────────
export const communicationApi = {
  getActivities: () => request("GET", "/communication/activities"),
  getActivity: (id) => request("GET", `/communication/activities/${id}`),
  evaluateDraft: (activity_id, user_response, allow_fallback = true) =>
    request("POST", "/communication/evaluate", { activity_id, user_response, allow_fallback }),
  submitPractice: (activity_id, user_response, evaluation = null, allow_fallback = true) =>
    request("POST", "/communication/submit", { activity_id, user_response, evaluation, allow_fallback }),
  getHistory: (activity_id = null) => {
    const qs = activity_id ? `?activity_id=${encodeURIComponent(activity_id)}` : "";
    return request("GET", `/communication/history${qs}`);
  },
  getStats: () => request("GET", "/communication/stats")
};
