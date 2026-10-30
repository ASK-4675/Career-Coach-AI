"use strict";

const path = require("path");
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const session = require("express-session");
const SqliteStore = require("connect-sqlite3")(session);

const { initDatabase, DB_PATH } = require("./database/init");

const app = express();
const PORT = parseInt(process.env.PORT || "5002", 10);
const isProd = process.env.NODE_ENV === "production";
const cookieSecure = process.env.COOKIE_SECURE === "true";

// ── CORS ──────────────────────────────────────────────────────
// Allow all origins (tighten in production by setting ALLOWED_ORIGINS env var
// to a comma-separated list of exact domains, e.g. https://myapp.onrender.com)
const rawOrigins = process.env.ALLOWED_ORIGINS || "*";
const allowAllOrigins = rawOrigins === "*";
const allowedOrigins = allowAllOrigins ? [] : rawOrigins.split(",").map((s) => s.trim());

app.use(cors({
  origin(origin, cb) {
    // Allow requests with no Origin header (curl, mobile apps, same-origin)
    if (!origin) return cb(null, true);
    if (allowAllOrigins) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true
}));

// ── Security & logging ────────────────────────────────────────
app.use(helmet());
app.use(morgan(isProd ? "combined" : "dev"));

// ── Body parsing ──────────────────────────────────────────────
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Session ───────────────────────────────────────────────────
const sessionDir = path.dirname(DB_PATH);
app.use(session({
  name: "careercoach.sid",
  secret: process.env.SESSION_SECRET || "dev_fallback_secret_change_me",
  resave: false,
  saveUninitialized: false,
  store: new SqliteStore({ db: "sessions.db", dir: sessionDir }),
  cookie: {
    httpOnly: true,
    secure: cookieSecure,           // true only when COOKIE_SECURE=true in .env
    sameSite: cookieSecure ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
  }
}));

// ── Routes ────────────────────────────────────────────────────
const { departmentsRouter, careerRolesRouter } = require("./routes/reference");

app.use("/api/auth", require("./routes/auth"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/departments", departmentsRouter);
app.use("/api/career-roles", careerRolesRouter);
app.use("/api/questions", require("./routes/questions"));
app.use("/api/communication", require("./routes/communication"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/interview", require("./routes/interview"));
app.use("/api/roadmap", require("./routes/roadmap"));

// static middleware moved later
// ── Health check ──────────────────────────────────────────────
app.get("/api/health", (_req, res) =>
  res.json({ status: "ok", ts: new Date().toISOString() })
);

// ── Serve built front‑end (always, not just in production) ────
// When running locally via `node backend/src/server.js` the dist/ folder
// is already built, so we serve it regardless of NODE_ENV.
const staticPath = path.resolve(__dirname, "../../dist");
app.use(express.static(staticPath));
// SPA fallback – send index.html for any non-API route
app.get("*", (req, res) => {
  res.sendFile(path.join(staticPath, "index.html"));
});
// ── 404 ───────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: "Not found." }));

// ── Global error handler ──────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error("[error]", err.message);
  res.status(err.status || 500).json({ error: err.message || "Internal server error." });
});

// ── Boot: init DB first, then listen ─────────────────────────
initDatabase()
  .then(() => {

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`\n🚀 CareerCoach AI backend → http://0.0.0.0:${PORT}`);
      console.log(`   Mode:    ${isProd ? "production" : "development"}`);
      console.log(`   CORS:    ${allowedOrigins.join(", ")}\n`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to initialize database:", err);
    process.exit(1);
  });
