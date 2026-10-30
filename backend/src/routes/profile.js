"use strict";

const express = require("express");
const { body } = require("express-validator");
const db = require("../database/db");
const { requireAuth } = require("../middleware/auth");
const { validate } = require("../middleware/validate");

const router = express.Router();
router.use(requireAuth);

const profileRules = [
  body("full_name").trim().isLength({ min: 2, max: 100 }).withMessage("Full name must be 2–100 characters."),
  body("college").optional().trim().isLength({ max: 200 }),
  body("degree").optional().trim().isLength({ max: 100 }),
  body("current_year").optional().isInt({ min: 1, max: 5 }).withMessage("Current year must be 1–5."),
  body("graduation_year").optional().isInt({ min: 2020, max: 2035 }),
  body("difficulty_level").optional().isIn(["easy", "medium", "hard"]),
  body("bio").optional().trim().isLength({ max: 500 }),
  body("linkedin_url").optional({ checkFalsy: true }).trim().isURL({ require_protocol: true }).withMessage("LinkedIn URL must be valid."),
  body("github_url").optional({ checkFalsy: true }).trim().isURL({ require_protocol: true }).withMessage("GitHub URL must be valid."),
  body("skills").optional().isArray().withMessage("Skills must be an array.")
];

// ── GET /api/profile ─────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const profile = await db.get(
      `SELECT sp.*, u.email FROM student_profiles sp
       JOIN users u ON u.id = sp.user_id WHERE sp.user_id = ?`,
      [req.session.userId]
    );
    if (!profile) return res.status(404).json({ error: "Profile not found." });

    profile.skills = safeJsonParse(profile.skills, []);
    return res.json({ profile });
  } catch (err) {
    console.error("[profile GET]", err);
    return res.status(500).json({ error: "Could not fetch profile." });
  }
});

// ── PUT /api/profile ─────────────────────────────────────────
router.put("/", validate(profileRules), async (req, res) => {
  // Accept aliases from frontend payload
  if (req.body.name && !req.body.full_name) {
    req.body.full_name = req.body.name;
  }
  // Ensure skills is an array even if sent as a comma‑separated string
  if (req.body.skills && typeof req.body.skills === "string") {
    try {
      req.body.skills = JSON.parse(req.body.skills);
    } catch {
      req.body.skills = req.body.skills.split(',').map(s => s.trim()).filter(Boolean);
    }
  }
  try {
    const userId = req.session.userId;
    const {
      full_name, college, degree, department_id, department_name,
      current_year, graduation_year, skills, target_role_id, target_role_name,
      difficulty_level, bio, linkedin_url, github_url
    } = req.body;

    const avatarInitials = full_name
      ? full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
      : null;

    const existing = await db.get("SELECT id FROM student_profiles WHERE user_id = ?", [userId]);

    if (existing) {
      await db.run(
        `UPDATE student_profiles SET
          full_name       = COALESCE(?, full_name),
          college         = ?,
          degree          = ?,
          department_id   = ?,
          department_name = ?,
          current_year    = ?,
          graduation_year = ?,
          skills          = ?,
          target_role_id  = ?,
          target_role_name = ?,
          difficulty_level = COALESCE(?, difficulty_level),
          bio             = ?,
          linkedin_url    = ?,
          github_url      = ?,
          avatar_initials = COALESCE(?, avatar_initials),
          updated_at      = strftime('%Y-%m-%dT%H:%M:%fZ','now')
        WHERE user_id = ?`,
        [
          full_name || null,
          college !== undefined ? college : null,
          degree !== undefined ? degree : null,
          department_id !== undefined ? department_id : null,
          department_name !== undefined ? department_name : null,
          current_year !== undefined ? current_year : null,
          graduation_year !== undefined ? graduation_year : null,
          skills !== undefined ? JSON.stringify(skills) : null,
          target_role_id !== undefined ? target_role_id : null,
          target_role_name !== undefined ? target_role_name : null,
          difficulty_level || null,
          bio !== undefined ? bio : null,
          linkedin_url !== undefined ? linkedin_url : null,
          github_url !== undefined ? github_url : null,
          avatarInitials,
          userId
        ]
      );
    } else {
      await db.run(
        `INSERT INTO student_profiles
          (user_id, full_name, college, degree, department_id, department_name,
           current_year, graduation_year, skills, target_role_id, target_role_name,
           difficulty_level, bio, linkedin_url, github_url, avatar_initials)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          userId, full_name, college || null, degree || null,
          department_id || null, department_name || null,
          current_year || null, graduation_year || null,
          JSON.stringify(skills || []),
          target_role_id || null, target_role_name || null,
          difficulty_level || "medium",
          bio || null, linkedin_url || null, github_url || null, avatarInitials
        ]
      );
    }

    const updated = await db.get(
      `SELECT sp.*, u.email FROM student_profiles sp
       JOIN users u ON u.id = sp.user_id WHERE sp.user_id = ?`,
      [userId]
    );
    updated.skills = safeJsonParse(updated.skills, []);
    return res.json({ message: "Profile updated successfully.", profile: updated });
  } catch (err) {
    console.error("[profile PUT]", err);
    return res.status(500).json({ error: "Could not update profile." });
  }
});

// ── PATCH /api/profile/department ────────────────────────────
router.patch("/department", async (req, res) => {
  const { department_id, department_name } = req.body;
  if (!department_id) return res.status(422).json({ error: "department_id is required." });
  try {
    await db.run(
      `UPDATE student_profiles SET department_id=?, department_name=?,
       updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE user_id=?`,
      [department_id, department_name || null, req.session.userId]
    );
    return res.json({ message: "Department updated." });
  } catch (err) {
    console.error("[dept patch]", err);
    return res.status(500).json({ error: "Could not update department." });
  }
});

// ── PATCH /api/profile/role ───────────────────────────────────
router.patch("/role", async (req, res) => {
  const { target_role_id, target_role_name } = req.body;
  if (!target_role_id) return res.status(422).json({ error: "target_role_id is required." });
  try {
    await db.run(
      `UPDATE student_profiles SET target_role_id=?, target_role_name=?,
       updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE user_id=?`,
      [target_role_id, target_role_name || null, req.session.userId]
    );
    return res.json({ message: "Career role updated." });
  } catch (err) {
    console.error("[role patch]", err);
    return res.status(500).json({ error: "Could not update role." });
  }
});

function safeJsonParse(str, fallback) {
  try { return JSON.parse(str); } catch { return fallback; }
}

module.exports = router;
