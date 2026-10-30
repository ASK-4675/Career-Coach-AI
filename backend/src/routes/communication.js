"use strict";

const express = require("express");
const { body } = require("express-validator");
const db = require("../database/db");
const { requireAuth } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { communicationActivities } = require("../data/communicationActivities");
const {
  evaluateCommunication,
  evaluateCommunicationWithLocalRubric,
  calculateTextMetrics
} = require("../services/communicationEvaluator");

const router = express.Router();
router.use(requireAuth);

// ── GET /api/communication/activities ─────────────────────────
// List all 10 practice activities with instructions
router.get("/activities", (_req, res) => {
  return res.json({ activities: communicationActivities });
});

// ── GET /api/communication/activities/:id ─────────────────────
// Get details for a specific activity
router.get("/activities/:id", (req, res) => {
  const activity = communicationActivities.find((a) => a.id === req.params.id);
  if (!activity) {
    return res.status(404).json({ error: "Communication activity not found." });
  }
  return res.json({ activity });
});

// ── POST /api/communication/evaluate ──────────────────────────
// Evaluate response text via AI or local rubric without committing to history
router.post(
  "/evaluate",
  validate([
    body("activity_id").notEmpty().withMessage("activity_id is required."),
    body("user_response").notEmpty().withMessage("Response text is required.")
  ]),
  async (req, res) => {
    try {
      const { activity_id, user_response, allow_fallback = false } = req.body;
      const activity = communicationActivities.find((a) => a.id === activity_id);
      if (!activity) {
        return res.status(404).json({ error: "Activity not found." });
      }

      const evalResult = await evaluateCommunication({
        activityId: activity.id,
        activityTitle: activity.title,
        promptText: activity.prompt,
        guidelines: activity.guidelines,
        userResponse: user_response
      });

      if (!evalResult.success && evalResult.serviceUnavailable) {
        if (allow_fallback) {
          const fallbackResult = evaluateCommunicationWithLocalRubric({
            activityId: activity.id,
            activityTitle: activity.title,
            promptText: activity.prompt,
            guidelines: activity.guidelines,
            userResponse: user_response
          });
          return res.json({ evaluation: fallbackResult });
        }

        return res.status(503).json({
          error: evalResult.error,
          canRetry: true,
          serviceUnavailable: true
        });
      }

      return res.json({ evaluation: evalResult });
    } catch (err) {
      console.error("[communication evaluate]", err);
      return res.status(500).json({ error: "Evaluation failed. Please try again." });
    }
  }
);

// ── POST /api/communication/submit ────────────────────────────
// Evaluate and save submission to user account
router.post(
  "/submit",
  validate([
    body("activity_id").notEmpty().withMessage("activity_id is required."),
    body("user_response").notEmpty().withMessage("user_response cannot be empty.")
  ]),
  async (req, res) => {
    try {
      const userId = req.session.userId;
      const { activity_id, user_response, evaluation, allow_fallback = true } = req.body;

      const activity = communicationActivities.find((a) => a.id === activity_id);
      if (!activity) {
        return res.status(404).json({ error: "Activity not found." });
      }

      let evalData = evaluation;
      if (!evalData) {
        const evalAttempt = await evaluateCommunication({
          activityId: activity.id,
          activityTitle: activity.title,
          promptText: activity.prompt,
          guidelines: activity.guidelines,
          userResponse: user_response
        });

        if (evalAttempt.success) {
          evalData = evalAttempt;
        } else if (allow_fallback) {
          evalData = evaluateCommunicationWithLocalRubric({
            activityId: activity.id,
            activityTitle: activity.title,
            promptText: activity.prompt,
            guidelines: activity.guidelines,
            userResponse: user_response
          });
        } else {
          return res.status(503).json({
            error: evalAttempt.error,
            canRetry: true,
            serviceUnavailable: true
          });
        }
      }

      const metrics = evalData.metrics || calculateTextMetrics(user_response);

      const result = await db.run(
        `INSERT INTO communication_submissions
           (user_id, activity_id, activity_title, prompt_text, user_response,
            score, grammar_score, clarity_score, vocab_score, tone_score, conciseness_score,
            strengths, improvements, revised_version, revision_rationale,
            follow_up_exercise, encouragement, word_count, reading_time_sec)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          activity.id,
          activity.title,
          activity.prompt,
          user_response,
          evalData.score || 0,
          evalData.scores?.grammar || null,
          evalData.scores?.clarity || null,
          evalData.scores?.vocabulary || null,
          evalData.scores?.tone || null,
          evalData.scores?.conciseness || null,
          evalData.strengths || null,
          evalData.improvements || null,
          evalData.revisedVersion || null,
          evalData.revisionRationale || null,
          evalData.followUpExercise || null,
          evalData.encouragement || null,
          metrics.wordCount || 0,
          metrics.estimatedDeliverySeconds || 0
        ]
      );

      return res.status(201).json({
        message: "Communication activity saved to your profile.",
        submissionId: result.lastID,
        evaluation: evalData
      });
    } catch (err) {
      console.error("[communication submit]", err);
      return res.status(500).json({ error: "Could not save communication practice." });
    }
  }
);

// ── GET /api/communication/history ────────────────────────────
// Fetch user's completed activities and changes over time
router.get("/history", async (req, res) => {
  try {
    const { activity_id } = req.query;
    let query = "SELECT * FROM communication_submissions WHERE user_id = ?";
    const params = [req.session.userId];

    if (activity_id) {
      query += " AND activity_id = ?";
      params.push(activity_id);
    }

    query += " ORDER BY created_at DESC LIMIT 50";

    const submissions = await db.all(query, params);
    return res.json({ submissions });
  } catch (err) {
    console.error("[communication history]", err);
    return res.status(500).json({ error: "Could not fetch communication history." });
  }
});

// ── GET /api/communication/stats ──────────────────────────────
// Summary statistics and progress trajectory
router.get("/stats", async (req, res) => {
  try {
    const userId = req.session.userId;
    const statsRow = await db.get(
      `SELECT
         COUNT(*) as total_attempts,
         COUNT(DISTINCT activity_id) as unique_activities,
         ROUND(AVG(score), 1) as avg_score,
         MAX(score) as best_score,
         ROUND(AVG(grammar_score), 1) as avg_grammar,
         ROUND(AVG(clarity_score), 1) as avg_clarity,
         ROUND(AVG(vocab_score), 1) as avg_vocab,
         ROUND(AVG(tone_score), 1) as avg_tone
       FROM communication_submissions
       WHERE user_id = ?`,
      [userId]
    );

    // Fetch chronological score progression (oldest to newest) to show changes over time
    const trend = await db.all(
      `SELECT id, activity_id, activity_title, score, grammar_score, clarity_score, created_at
       FROM communication_submissions
       WHERE user_id = ?
       ORDER BY created_at ASC LIMIT 20`,
      [userId]
    );

    return res.json({
      stats: {
        totalAttempts: statsRow?.total_attempts || 0,
        uniqueActivitiesCompleted: statsRow?.unique_activities || 0,
        averageScore: statsRow?.avg_score || 0,
        bestScore: statsRow?.best_score || 0,
        avgGrammar: statsRow?.avg_grammar || 0,
        avgClarity: statsRow?.avg_clarity || 0,
        avgVocab: statsRow?.avg_vocab || 0,
        avgTone: statsRow?.avg_tone || 0
      },
      trend
    });
  } catch (err) {
    console.error("[communication stats]", err);
    return res.status(500).json({ error: "Could not fetch communication stats." });
  }
});

module.exports = router;
