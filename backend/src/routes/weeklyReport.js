"use strict";

// Weekly Report Route - provides analytics for the past week
// Uses SQLite DB to compute real metrics instead of demo data

const express = require("express");
const db = require("../database/db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

// Helper to compute hours difference between two ISO timestamps
function hoursBetween(start, end) {
  if (!start || !end) return 0;
  const diffMs = new Date(end) - new Date(start);
  return diffMs / (1000 * 60 * 60);
}

// GET /api/weekly-report
router.get("/", async (req, res) => {
  try {
    const userId = req.session.userId;
    // 1. Total interview time logged in the last 7 days
    const sessions = await db.all(
      `SELECT started_at, completed_at FROM interview_sessions WHERE user_id = ? AND started_at >= datetime('now', '-7 days')`,
      [userId]
    );
    const hoursLogged = sessions.reduce((sum, s) => sum + hoursBetween(s.started_at, s.completed_at), 0);

    // 2. Mock interviews completed (status='completed') in the last week
    const mockCompleted = await db.get(
      `SELECT COUNT(*) AS cnt FROM interview_sessions WHERE user_id = ? AND status = 'completed' AND started_at >= datetime('now', '-7 days')`,
      [userId]
    );
    const mockInterviewsCompleted = mockCompleted.cnt || 0;

    // 3. Technical and Communication scores averages over answers in last week
    const answers = await db.all(
      `SELECT question_type, score FROM interview_answers WHERE user_id = ? AND answered_at >= datetime('now', '-7 days') AND score IS NOT NULL`,
      [userId]
    );
    let techScores = [], commScores = [];
    answers.forEach(a => {
      if (a.question_type && a.question_type.toLowerCase().includes('technical')) techScores.push(a.score);
      else if (a.question_type && a.question_type.toLowerCase().includes('communication')) commScores.push(a.score);
      else if (a.question_type && a.question_type.toLowerCase().includes('hr')) commScores.push(a.score);
    });
    const avg = arr => arr.length ? Math.round(arr.reduce((s, v) => s + v, 0) / arr.length) : null;
    const technicalAccuracy = avg(techScores);
    const communicationAccuracy = avg(commScores);

    // 4. Highlights – pick up to 3 categories with lowest scores
    const highlights = [];
    if (technicalAccuracy !== null) highlights.push({ title: "Technical", desc: `Average score ${technicalAccuracy}/100` });
    if (communicationAccuracy !== null) highlights.push({ title: "Communication", desc: `Average score ${communicationAccuracy}/100` });
    highlights.push({ title: "Mock Interviews", desc: `${mockInterviewsCompleted} completed this week` });

    // 5. Target hours based on difficulty level from student profile
    const profile = await db.get(`SELECT difficulty_level FROM student_profiles WHERE user_id = ?`, [userId]);
    const difficulty = profile?.difficulty_level?.toLowerCase() || "medium";
    const hoursTargetMap = { easy: 10, medium: 15, hard: 20 };
    const hoursTarget = hoursTargetMap[difficulty] || 15;

    // 6. Day‑by‑day breakdown
    const breakdownRows = await db.all(
      `SELECT date(answered_at) as day,
              SUM(CASE WHEN lower(question_type) LIKE '%technical%' OR lower(question_type) LIKE '%coding%' THEN 1 ELSE 0 END) AS dsa,
              SUM(CASE WHEN lower(question_type) LIKE '%system design%' THEN 1 ELSE 0 END) AS systemDesign,
              SUM(CASE WHEN lower(question_type) LIKE '%communication%' OR lower(question_type) LIKE '%hr%' THEN 1 ELSE 0 END) AS softSkills,
              COUNT(*) AS totalAnswers
         FROM interview_answers
        WHERE user_id = ? AND answered_at >= datetime('now','-7 days')
        GROUP BY day
        ORDER BY day ASC`,
      [userId]
    );
    const dayBreakdown = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const iso = date.toISOString().split('T')[0];
      const row = breakdownRows.find(r => r.day === iso);
      dayBreakdown.push({
        day: iso,
        dsa: row?.dsa || 0,
        systemDesign: row?.systemDesign || 0,
        softSkills: row?.softSkills || 0,
        completed: row?.totalAnswers > 0
      });
    }

    // 7. Coach remarks based on averages
    let coachRemarks = "Keep up the good work!";
    if (technicalAccuracy !== null && technicalAccuracy < 70) coachRemarks = "Focus on strengthening technical fundamentals.";
    else if (communicationAccuracy !== null && communicationAccuracy < 70) coachRemarks = "Practice clearer communication and STAR responses.";
    else if (technicalAccuracy >= 85 && communicationAccuracy >= 85) coachRemarks = "Excellent performance this week!";

    return res.json({
      weekPeriod: "Last 7 days",
      hoursLogged: Math.round(hoursLogged * 10) / 10,
      hoursTarget,
      mockInterviewsCompleted,
      technicalAccuracy,
      communicationAccuracy,
      coachRemarks,
      highlights,
      dayBreakdown
    });
  } catch (err) {
    console.error("[weekly report]", err);
    return res.status(500).json({ error: "Could not generate weekly report." });
  }
});

module.exports = router;
