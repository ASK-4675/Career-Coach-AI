"use strict";

const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const sqlite3 = require("sqlite3").verbose();

const DB_PATH = process.env.DB_PATH
  ? path.resolve(__dirname, "../../", process.env.DB_PATH)
  : path.join(__dirname, "../../data/careercoach.db");

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

function initDatabase() {
  return new Promise((resolve, reject) => {
    // Never delete existing DB — only create tables IF NOT EXISTS
    const db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) return reject(err);
    });

    db.serialize(() => {
      db.run("PRAGMA journal_mode = WAL");
      db.run("PRAGMA foreign_keys = ON");

      db.exec(`
        -- 1. USERS
        CREATE TABLE IF NOT EXISTS users (
          id            INTEGER PRIMARY KEY AUTOINCREMENT,
          email         TEXT    NOT NULL UNIQUE COLLATE NOCASE,
          password_hash TEXT    NOT NULL,
          created_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
          updated_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
        );

        -- 2. STUDENT_PROFILES
        CREATE TABLE IF NOT EXISTS student_profiles (
          id              INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id         INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
          full_name       TEXT    NOT NULL,
          college         TEXT,
          degree          TEXT,
          department_id   TEXT,
          department_name TEXT,
          current_year    INTEGER,
          graduation_year INTEGER,
          skills          TEXT    DEFAULT '[]',
          target_role_id  TEXT,
          target_role_name TEXT,
          difficulty_level TEXT   DEFAULT 'medium',
          bio             TEXT,
          linkedin_url    TEXT,
          github_url      TEXT,
          avatar_initials TEXT,
          created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
          updated_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
        );

        -- 3. CAREER_ROLES
        CREATE TABLE IF NOT EXISTS career_roles (
          id                TEXT PRIMARY KEY,
          title             TEXT NOT NULL,
          category          TEXT NOT NULL,
          recommended_depts TEXT NOT NULL DEFAULT '[]',
          core_skills       TEXT NOT NULL DEFAULT '[]',
          description       TEXT
        );

        -- 4. INTERVIEW_SESSIONS
        CREATE TABLE IF NOT EXISTS interview_sessions (
          id            INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          role_id       TEXT,
          difficulty    TEXT    NOT NULL DEFAULT 'medium',
          status        TEXT    NOT NULL DEFAULT 'in_progress',
          score         REAL,
          total_questions INTEGER,
          feedback_summary TEXT,
          started_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
          completed_at  TEXT
        );

        -- 5. INTERVIEW_ANSWERS
        CREATE TABLE IF NOT EXISTS interview_answers (
          id            INTEGER PRIMARY KEY AUTOINCREMENT,
          session_id    INTEGER NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
          user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          question_text TEXT    NOT NULL,
          question_type TEXT,
          user_answer   TEXT,
          ai_feedback   TEXT,
          score         REAL,
          answered_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
        );

        -- 6. PROGRESS_RECORDS
        CREATE TABLE IF NOT EXISTS progress_records (
          id          INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          metric_key  TEXT    NOT NULL,
          metric_value TEXT   NOT NULL,
          recorded_at TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
        );

        -- 7. ROADMAP_TASKS
        CREATE TABLE IF NOT EXISTS roadmap_tasks (
          id          INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          week_number INTEGER NOT NULL,
          week_label  TEXT,
          task_title  TEXT    NOT NULL,
          task_type   TEXT,
          is_done     INTEGER NOT NULL DEFAULT 0,
          created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
          updated_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
        );

        -- 8. QUESTIONS (Question Bank)
        CREATE TABLE IF NOT EXISTS questions (
          id                TEXT PRIMARY KEY,
          category          TEXT NOT NULL,
          interview_type    TEXT NOT NULL,
          department_id     TEXT DEFAULT 'all',
          role_id           TEXT DEFAULT 'all',
          difficulty        TEXT NOT NULL DEFAULT 'medium',
          question_text     TEXT NOT NULL,
          reference_answer  TEXT,
          evaluation_rubric TEXT,
          created_at        TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
        );

        -- 9. COMMUNICATION_SUBMISSIONS (Phase 5 Communication Coach)
        CREATE TABLE IF NOT EXISTS communication_submissions (
          id                  INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id             INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          activity_id         TEXT    NOT NULL,
          activity_title      TEXT    NOT NULL,
          prompt_text         TEXT    NOT NULL,
          user_response       TEXT    NOT NULL,
          score               INTEGER NOT NULL,
          grammar_score       INTEGER,
          clarity_score       INTEGER,
          vocab_score         INTEGER,
          tone_score          INTEGER,
          conciseness_score   INTEGER,
          strengths           TEXT,
          improvements        TEXT,
          revised_version     TEXT,
          revision_rationale  TEXT,
          follow_up_exercise  TEXT,
          encouragement       TEXT,
          word_count          INTEGER,
          reading_time_sec    INTEGER,
          created_at          TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
        );

        -- Indexes
        CREATE INDEX IF NOT EXISTS idx_sp_user ON student_profiles(user_id);
        CREATE INDEX IF NOT EXISTS idx_is_user ON interview_sessions(user_id);
        CREATE INDEX IF NOT EXISTS idx_ia_session ON interview_answers(session_id);
        CREATE INDEX IF NOT EXISTS idx_ia_user ON interview_answers(user_id);
        CREATE INDEX IF NOT EXISTS idx_pr_user ON progress_records(user_id);
        CREATE INDEX IF NOT EXISTS idx_rt_user ON roadmap_tasks(user_id);
        CREATE INDEX IF NOT EXISTS idx_q_cat ON questions(category);
        CREATE INDEX IF NOT EXISTS idx_q_type ON questions(interview_type);
        CREATE INDEX IF NOT EXISTS idx_q_dept ON questions(department_id);
        CREATE INDEX IF NOT EXISTS idx_q_diff ON questions(difficulty);
        CREATE INDEX IF NOT EXISTS idx_cs_user ON communication_submissions(user_id);
        CREATE INDEX IF NOT EXISTS idx_cs_act ON communication_submissions(activity_id);
      `, (err) => {
        if (err) {
          db.close();
          return reject(err);
        }

        // Run safe column migrations for Phase 4 interview extensions
        safeAddColumns(db, () => {
          // Seed career_roles if empty
          db.get("SELECT COUNT(*) as count FROM career_roles", (err2, row) => {
            if (err2) { db.close(); return reject(err2); }

            const onQuestionsDone = () => {
              seedDemoUser(db, () => {
                db.close();
                console.log(`✅ Database ready: ${DB_PATH}`);
                resolve(DB_PATH);
              });
            };

            const onRolesDone = () => {
              seedQuestions(db, () => {
                onQuestionsDone();
              });
            };

            if (row.count === 0) {
              seedCareerRoles(db, () => {
                console.log("✅ Career roles seeded.");
                onRolesDone();
              });
            } else {
              onRolesDone();
            }
          });
        });
      });
    });
  });
}

function safeAddColumns(db, done) {
  const migrations = [
    "ALTER TABLE interview_sessions ADD COLUMN interview_type TEXT DEFAULT 'mixed'",
    "ALTER TABLE interview_sessions ADD COLUMN questions_list TEXT DEFAULT '[]'",
    "ALTER TABLE interview_sessions ADD COLUMN current_question_index INTEGER DEFAULT 0",
    "ALTER TABLE interview_answers ADD COLUMN question_id TEXT",
    "ALTER TABLE interview_answers ADD COLUMN verdict TEXT",
    "ALTER TABLE interview_answers ADD COLUMN what_did_well TEXT",
    "ALTER TABLE interview_answers ADD COLUMN missing_points TEXT",
    "ALTER TABLE interview_answers ADD COLUMN suggested_answer TEXT",
    "ALTER TABLE interview_answers ADD COLUMN improvement_tip TEXT",
    "ALTER TABLE interview_answers ADD COLUMN encouragement TEXT",
    "ALTER TABLE interview_answers ADD COLUMN evaluation_source TEXT",
    "ALTER TABLE interview_sessions ADD COLUMN interview_mode TEXT DEFAULT 'text'",
    "ALTER TABLE interview_sessions ADD COLUMN feedback_mode TEXT DEFAULT 'immediate'",
    "ALTER TABLE interview_answers ADD COLUMN input_mode TEXT DEFAULT 'text'"
  ];

  let i = 0;
  function next() {
    if (i >= migrations.length) return done();
    db.run(migrations[i], () => {
      // Ignore duplicate column errors if already added
      i++;
      next();
    });
  }
  next();
}

function seedQuestions(db, done) {
  const { questionsCatalog } = require("./questionsCatalog");
  db.get("SELECT COUNT(*) as count FROM questions", (err, row) => {
    if (err || (row && row.count >= questionsCatalog.length)) return done();

    const stmt = `INSERT OR REPLACE INTO questions
      (id, category, interview_type, department_id, role_id, difficulty, question_text, reference_answer, evaluation_rubric)
      VALUES (?,?,?,?,?,?,?,?,?)`;

    let i = 0;
    function next() {
      if (i >= questionsCatalog.length) {
        console.log(`✅ ${questionsCatalog.length} interview questions seeded into Question Bank.`);
        return done();
      }
      const q = questionsCatalog[i];
      db.run(stmt, [
        q.id,
        q.category,
        q.interview_type,
        q.department_id || "all",
        q.role_id || "all",
        q.difficulty,
        q.question_text,
        q.reference_answer || null,
        q.evaluation_rubric || null
      ], (errIns) => {
        if (errIns) console.warn("Question seed warn:", errIns.message);
        i++;
        next();
      });
    }
    next();
  });
}

function seedDemoUser(db, done) {
  const email = "aarav.sharma@nit.edu.in";
  db.get("SELECT id FROM users WHERE email = ?", [email], (err, row) => {
    if (err || row) return done();

    const bcrypt = require("bcrypt");
    bcrypt.hash("Password123", 12, (errHash, hash) => {
      if (errHash) return done();

      db.run(
        "INSERT INTO users (email, password_hash) VALUES (?, ?)",
        [email, hash],
        function(errIns) {
          if (errIns) return done();
          const userId = this.lastID;

          db.run(
            `INSERT INTO student_profiles
              (user_id, full_name, college, degree, department_id, department_name,
               current_year, graduation_year, skills, target_role_id, target_role_name,
               difficulty_level, bio, linkedin_url, github_url, avatar_initials)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [
              userId,
              "Aarav Sharma",
              "National Institute of Technology",
              "B.Tech in Computer Science & Engineering",
              "cse",
              "Computer Science Engineering",
              4,
              2026,
              JSON.stringify(["JavaScript", "React", "Node.js", "Java", "SQL"]),
              "full-stack-developer",
              "Full-Stack Developer",
              "medium",
              "Pre-final engineering student preparing for Tier-1 software engineering placements.",
              "https://linkedin.com/in/aarav-sharma-cs",
              "https://github.com/aaravsharma-dev",
              "AS"
            ],
            () => {
              console.log("✅ Demo student (aarav.sharma@nit.edu.in / Password123) seeded.");
              done();
            }
          );
        }
      );
    });
  });
}

function seedCareerRoles(db, done) {
  const roles = [
    ["software-developer","Software Developer","Engineering",'["cse","it","aids"]','["DSA","OOP","Git","System Design"]',"General software development"],
    ["frontend-developer","Frontend Developer","Engineering",'["cse","it","aids"]','["HTML","CSS","JavaScript","React"]',"UI-focused web development"],
    ["backend-developer","Backend Developer","Engineering",'["cse","it","aids"]','["Node.js","Databases","REST APIs","System Design"]',"Server-side development"],
    ["full-stack-developer","Full-Stack Developer","Engineering",'["cse","it","aids"]','["React","Node.js","Databases","DevOps"]',"End-to-end web development"],
    ["qa-engineer","QA / Test Engineer","Engineering",'["cse","it","ece"]','["Testing","Automation","Selenium","JIRA"]',"Quality assurance"],
    ["data-analyst","Data Analyst","Data",'["aids","cse","it","mech"]','["SQL","Python","Excel","Tableau"]',"Analyze and visualize data"],
    ["data-scientist","Data Scientist","Data",'["aids","cse","it"]','["Python","ML","Statistics","SQL"]',"Build ML models"],
    ["ai-ml-engineer","AI / ML Engineer","AI",'["aids","cse","it"]','["Deep Learning","TensorFlow","Python","Math"]',"Design AI/ML systems"],
    ["cybersecurity-analyst","Cybersecurity Analyst","Security",'["cse","it","ece"]','["Networking","Penetration Testing","SIEM","Cryptography"]',"Protect systems"],
    ["cloud-engineer","Cloud Engineer","Infrastructure",'["cse","it","ece","eee"]','["AWS","Docker","Kubernetes","CI/CD"]',"Cloud infrastructure"],
    ["ui-ux-designer","UI/UX Designer","Design",'["cse","it","aids"]','["Figma","User Research","Prototyping","CSS"]',"Design user experiences"],
    ["digital-marketer","Digital Marketer","Marketing",'["cse","it","civil","other"]','["SEO","Analytics","Content","Ads"]',"Online marketing"],
    ["product-manager","Product Manager","Management",'["cse","it","mech","civil"]','["Roadmapping","Agile","Analytics","Communication"]',"Lead product lifecycle"],
    ["business-analyst","Business Analyst","Business",'["cse","it","mech","civil"]','["Requirements","SQL","Excel","Communication"]',"Bridge business and tech"],
    ["embedded-engineer","Embedded Systems Engineer","Hardware",'["ece","eee","mech"]','["C","Microcontrollers","RTOS","Hardware"]',"Embedded programming"],
    ["vlsi-engineer","VLSI Engineer","Hardware",'["ece","eee"]','["VHDL","Verilog","Cadence","CMOS"]',"Chip design"],
    ["iot-engineer","IoT Engineer","Hardware",'["ece","eee","cse"]','["Arduino","MQTT","C++","Cloud IoT"]',"Connect devices to cloud"],
    ["network-engineer","Network Engineer","Infrastructure",'["ece","eee","cse","it"]','["CCNA","TCP/IP","Routing","Firewalls"]',"Manage networks"],
    ["mechanical-design","Mechanical Design Engineer","Mechanical",'["mech"]','["CAD","SolidWorks","FEA","GD&T"]',"Design mechanical systems"],
    ["core-civil","Civil / Structural Engineer","Civil",'["civil"]','["AutoCAD","STAAD","Surveying","Concrete Design"]',"Civil infrastructure"],
    ["biomedical-engineer","Biomedical Engineer","Biomedical",'["biomedical","ece","eee"]','["Medical Devices","Signal Processing","Biomechanics"]',"Medical devices"],
    ["devops-engineer","DevOps Engineer","Infrastructure",'["cse","it"]','["CI/CD","Docker","Kubernetes","Shell Scripting"]',"Automate delivery pipelines"],
    ["site-reliability","Site Reliability Engineer","Infrastructure",'["cse","it"]','["Monitoring","Incident Response","SLOs","Linux"]',"System reliability"]
  ];

  const stmt = "INSERT OR IGNORE INTO career_roles (id,title,category,recommended_depts,core_skills,description) VALUES (?,?,?,?,?,?)";
  let i = 0;
  function next() {
    if (i >= roles.length) return done();
    db.run(stmt, roles[i], (err) => {
      if (err) console.warn("Seed warn:", err.message);
      i++;
      next();
    });
  }
  next();
}

// Run directly: node src/database/init.js
if (require.main === module) {
  initDatabase().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
}

module.exports = { initDatabase, DB_PATH };
