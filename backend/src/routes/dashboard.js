"use strict";

const express = require("express");
const db = require("../database/db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

router.get("/", async (req, res) => {
  try {
    const userId = req.session.userId;

    const profile = await db.get(
      `SELECT full_name, avatar_initials, department_name, target_role_name,
              graduation_year, difficulty_level
       FROM student_profiles WHERE user_id = ?`,
      [userId]
    );

    const interviewStats = await db.get(
      `SELECT
         COUNT(*) AS total_sessions,
         SUM(CASE WHEN status='completed' THEN 1 ELSE 0 END) AS completed_sessions,
         ROUND(AVG(CASE WHEN status='completed' THEN score END), 1) AS avg_score
       FROM interview_sessions WHERE user_id = ?`,
      [userId]
    );

    const recentSessions = await db.all(
      `SELECT id, role_id, difficulty, status, score, started_at, completed_at
       FROM interview_sessions WHERE user_id = ?
       ORDER BY started_at DESC LIMIT 5`,
      [userId]
    );

    const roadmapStats = await db.get(
      `SELECT COUNT(*) AS total_tasks, SUM(is_done) AS done_tasks
       FROM roadmap_tasks WHERE user_id = ?`,
      [userId]
    );

    const total = roadmapStats.total_tasks || 0;
    const done = roadmapStats.done_tasks || 0;

    return res.json({
      profile: profile || {},
      interviews: {
        total: interviewStats.total_sessions || 0,
        completed: interviewStats.completed_sessions || 0,
        avgScore: interviewStats.avg_score || 0
      },
      recentSessions,
      roadmap: { total, done, percent: total > 0 ? Math.round((done / total) * 100) : 0 }
    });
  } catch (err) {
    console.error("[dashboard]", err);
    return res.status(500).json({ error: "Could not fetch dashboard data." });
  }
});

module.exports = router;
