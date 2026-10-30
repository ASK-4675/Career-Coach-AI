"use strict";

const express = require("express");
const db = require("../database/db");

const router = express.Router();

// ── GET /api/questions ────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const {
      category,
      type,
      department_id,
      role_id,
      difficulty,
      search,
      limit = 50,
      offset = 0
    } = req.query;

    const conditions = [];
    const params = [];

    if (category && category !== "All") {
      conditions.push("category = ?");
      params.push(category);
    }

    if (type && type !== "All") {
      conditions.push("interview_type = ?");
      params.push(type.toLowerCase());
    }

    if (department_id && department_id !== "all" && department_id !== "All") {
      conditions.push("(department_id = ? OR department_id = 'all')");
      params.push(department_id.toLowerCase());
    }

    if (role_id && role_id !== "all" && role_id !== "All") {
      conditions.push("(role_id = ? OR role_id = 'all')");
      params.push(role_id.toLowerCase());
    }

    if (difficulty && difficulty !== "All") {
      conditions.push("LOWER(difficulty) = ?");
      params.push(difficulty.toLowerCase());
    }

    if (search && search.trim()) {
      conditions.push("(question_text LIKE ? OR category LIKE ? OR reference_answer LIKE ?)");
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const totalRow = await db.get(
      `SELECT COUNT(*) as total FROM questions ${whereClause}`,
      params
    );

    const questions = await db.all(
      `SELECT id, category, interview_type, department_id, role_id, difficulty,
              question_text, reference_answer, evaluation_rubric, created_at
       FROM questions ${whereClause}
       ORDER BY id ASC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit, 10), parseInt(offset, 10)]
    );

    return res.json({
      total: totalRow ? totalRow.total : 0,
      count: questions.length,
      questions
    });
  } catch (err) {
    console.error("[questions GET]", err);
    return res.status(500).json({ error: "Could not fetch questions." });
  }
});

// ── GET /api/questions/categories ─────────────────────────────
router.get("/categories", async (_req, res) => {
  try {
    const rows = await db.all(
      `SELECT category, COUNT(*) as count FROM questions GROUP BY category ORDER BY count DESC`
    );
    return res.json({ categories: rows });
  } catch (err) {
    console.error("[questions categories]", err);
    return res.status(500).json({ error: "Could not fetch categories." });
  }
});

// ── GET /api/questions/:id ────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const question = await db.get("SELECT * FROM questions WHERE id = ?", [req.params.id]);
    if (!question) {
      return res.status(404).json({ error: "Question not found." });
    }
    return res.json({ question });
  } catch (err) {
    console.error("[question GET by id]", err);
    return res.status(500).json({ error: "Could not fetch question." });
  }
});

module.exports = router;
