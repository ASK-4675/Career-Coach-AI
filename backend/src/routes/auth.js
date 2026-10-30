"use strict";

const express = require("express");
const bcrypt = require("bcrypt");
const { body } = require("express-validator");
const db = require("../database/db");
const { validate } = require("../middleware/validate");

const router = express.Router();
const SALT_ROUNDS = 12;

const registerRules = [
  body("email").isEmail().withMessage("A valid email address is required.").normalizeEmail(),
  body("password")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters.")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter.")
    .matches(/[0-9]/).withMessage("Password must contain at least one number."),
  body("name").trim().isLength({ min: 2, max: 100 }).withMessage("Full name must be 2–100 characters.")
];

const loginRules = [
  body("email").isEmail().withMessage("Valid email is required.").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required.")
];

// ── POST /api/auth/register ──────────────────────────────────
router.post("/register", validate(registerRules), async (req, res) => {
  try {
    const { email, password, name, college, department, department_id, graduation_year } = req.body;

    const existing = await db.get("SELECT id FROM users WHERE email = ?", [email]);
    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const userResult = await db.run(
      "INSERT INTO users (email, password_hash) VALUES (?, ?)",
      [email, passwordHash]
    );
    const userId = userResult.lastID;

    const avatarInitials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    await db.run(
      `INSERT INTO student_profiles (user_id, full_name, college, department_name, department_id, graduation_year, avatar_initials)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, name, college || null, department || null, department_id || null,
       graduation_year ? parseInt(graduation_year, 10) : null, avatarInitials]
    );

    req.session.userId = userId;
    req.session.email = email;
    req.session.name = name;

    return res.status(201).json({
      message: "Account created successfully.",
      user: { id: userId, email, name, avatarInitials }
    });
  } catch (err) {
    console.error("[register]", err);
    return res.status(500).json({ error: "Registration failed. Please try again." });
  }
});

// ── POST /api/auth/login ─────────────────────────────────────
router.post("/login", validate(loginRules), async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db.get(
      "SELECT id, email, password_hash FROM users WHERE email = ?",
      [email]
    );
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const profile = await db.get(
      "SELECT full_name, avatar_initials FROM student_profiles WHERE user_id = ?",
      [user.id]
    );

    req.session.regenerate((err) => {
      if (err) {
        console.error("[login session]", err);
        return res.status(500).json({ error: "Session error. Please try again." });
      }
      req.session.userId = user.id;
      req.session.email = user.email;
      req.session.name = profile ? profile.full_name : user.email;

      return res.json({
        message: "Signed in successfully.",
        user: {
          id: user.id,
          email: user.email,
          name: profile ? profile.full_name : user.email,
          avatarInitials: profile ? profile.avatar_initials : "?"
        }
      });
    });
  } catch (err) {
    console.error("[login]", err);
    return res.status(500).json({ error: "Login failed. Please try again." });
  }
});

// ── POST /api/auth/logout ────────────────────────────────────
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("[logout]", err);
      return res.status(500).json({ error: "Logout failed." });
    }
    res.clearCookie("careercoach.sid");
    return res.json({ message: "Logged out successfully." });
  });
});

// ── GET /api/auth/me ─────────────────────────────────────────
router.get("/me", async (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: "Not authenticated." });
  }
  try {
    const user = await db.get("SELECT id, email FROM users WHERE id = ?", [req.session.userId]);
    if (!user) return res.status(401).json({ error: "Session invalid." });

    const profile = await db.get(
      "SELECT full_name, avatar_initials FROM student_profiles WHERE user_id = ?",
      [user.id]
    );
    return res.json({
      user: {
        id: user.id,
        email: user.email,
        name: profile ? profile.full_name : user.email,
        avatarInitials: profile ? profile.avatar_initials : "?"
      }
    });
  } catch (err) {
    console.error("[me]", err);
    return res.status(500).json({ error: "Could not fetch session." });
  }
});

module.exports = router;
