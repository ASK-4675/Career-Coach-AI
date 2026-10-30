"use strict";

const express = require("express");
const { body } = require("express-validator");
const db = require("../database/db");
const { requireAuth } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { evaluateAnswer, evaluateWithLocalRubric } = require("../services/aiCoach");

const router = express.Router();
router.use(requireAuth);

// ── POST /api/interview/sessions ─────────────────────────────
// Start a new configured interview session
router.post(
  "/sessions",
  validate([
    body("difficulty").optional().isIn(["easy", "medium", "hard"]),
    body("interview_type").optional().isIn(["hr", "technical", "behavioral", "aptitude", "mixed"]),
    body("role_id").optional().trim(),
    body("question_count").optional().isInt({ min: 1, max: 15 }),
    body("interview_mode").optional().isIn(["video", "voice", "text"]),
    body("feedback_mode").optional().isIn(["immediate", "end_of_interview"])
  ]),
  async (req, res) => {
    try {
      const userId = req.session.userId;
      const {
        role_id,
        difficulty = "medium",
        interview_type = "mixed",
        question_count = 3,
        interview_mode = "video",
        feedback_mode = "immediate"
      } = req.body;

      const profile = await db.get("SELECT department_id FROM student_profiles WHERE user_id = ?", [userId]);
      const deptId = profile ? profile.department_id : "all";

      // Build question selection query
      let candidateQuestions = [];

      if (interview_type === "mixed") {
        // Balanced mix: 1 HR/behavioral, remaining technical/departmental
        const hrQ = await db.all(
          `SELECT * FROM questions WHERE interview_type IN ('hr', 'behavioral') ORDER BY RANDOM() LIMIT 1`
        );
        const techQ = await db.all(
          `SELECT * FROM questions
           WHERE interview_type = 'technical'
             AND (department_id = ? OR department_id = 'all' OR role_id = ? OR role_id = 'all')
           ORDER BY RANDOM() LIMIT ?`,
          [deptId || "all", role_id || "all", Math.max(1, question_count - 1)]
        );
        candidateQuestions = [...hrQ, ...techQ];
      } else {
        candidateQuestions = await db.all(
          `SELECT * FROM questions
           WHERE interview_type = ?
             AND (department_id = ? OR department_id = 'all' OR role_id = ? OR role_id = 'all')
           ORDER BY RANDOM() LIMIT ?`,
          [interview_type, deptId || "all", role_id || "all", question_count]
        );
      }

      // If fewer questions found than requested, fill with general technical/behavioral questions
      if (candidateQuestions.length < question_count) {
        const existingIds = candidateQuestions.map((q) => q.id);
        const placeholders = existingIds.length > 0 ? existingIds.map(() => "?").join(",") : "''";
        const needed = question_count - candidateQuestions.length;
        const fallbackQ = await db.all(
          `SELECT * FROM questions WHERE id NOT IN (${placeholders}) ORDER BY RANDOM() LIMIT ?`,
          [...existingIds, needed]
        );
        candidateQuestions = [...candidateQuestions, ...fallbackQ];
      }

      const questionIds = candidateQuestions.map((q) => q.id);

      const result = await db.run(
        `INSERT INTO interview_sessions
           (user_id, role_id, difficulty, interview_type, total_questions, questions_list, current_question_index, status, interview_mode, feedback_mode)
         VALUES (?, ?, ?, ?, ?, ?, 0, 'in_progress', ?, ?)`,
        [
          userId,
          role_id || null,
          difficulty,
          interview_type,
          candidateQuestions.length,
          JSON.stringify(questionIds),
          interview_mode,
          feedback_mode
        ]
      );

      const sessionId = result.lastID;

      return res.status(201).json({
        message: "Interview session started.",
        session: {
          id: sessionId,
          role_id,
          difficulty,
          interview_type,
          interview_mode,
          feedback_mode,
          total_questions: candidateQuestions.length,
          current_question_index: 0,
          status: "in_progress"
        },
        questions: candidateQuestions
      });
    } catch (err) {
      console.error("[interview start]", err);
      return res.status(500).json({ error: "Could not start interview session." });
    }
  }
);

// ── GET /api/interview/sessions ───────────────────────────────
// List student's past sessions
router.get("/sessions", async (req, res) => {
  try {
    const sessions = await db.all(
      `SELECT * FROM interview_sessions WHERE user_id = ? ORDER BY started_at DESC LIMIT 25`,
      [req.session.userId]
    );
    return res.json({ sessions });
  } catch (err) {
    console.error("[interview list]", err);
    return res.status(500).json({ error: "Could not list sessions." });
  }
});

// ── GET /api/interview/sessions/:id ──────────────────────────
// Get session details and all answered questions
router.get("/sessions/:id", async (req, res) => {
  try {
    const session = await db.get(
      "SELECT * FROM interview_sessions WHERE id = ? AND user_id = ?",
      [req.params.id, req.session.userId]
    );
    if (!session) return res.status(404).json({ error: "Session not found." });

    // Load full question list if available
    let questions = [];
    try {
      const qIds = JSON.parse(session.questions_list || "[]");
      if (qIds.length > 0) {
        const placeholders = qIds.map(() => "?").join(",");
        const qRows = await db.all(`SELECT * FROM questions WHERE id IN (${placeholders})`, qIds);
        // Preserve original order
        const map = new Map(qRows.map((q) => [q.id, q]));
        questions = qIds.map((id) => map.get(id)).filter(Boolean);
      }
    } catch (e) {
      console.warn("Could not parse session questions_list:", e);
    }

    const answers = await db.all(
      "SELECT * FROM interview_answers WHERE session_id = ? ORDER BY answered_at ASC",
      [session.id]
    );

    return res.json({ session, questions, answers });
  } catch (err) {
    console.error("[interview get]", err);
    return res.status(500).json({ error: "Could not fetch session." });
  }
});

// ── POST /api/interview/sessions/:id/evaluate ────────────────
// Evaluate a single question answer via AI (allows review & retry before finalizing)
router.post("/sessions/:id/evaluate", async (req, res) => {
  try {
    const userId = req.session.userId;
    const session = await db.get(
      "SELECT id, status FROM interview_sessions WHERE id = ? AND user_id = ?",
      [req.params.id, userId]
    );
    if (!session) return res.status(404).json({ error: "Session not found." });
    if (session.status === "completed") {
      return res.status(409).json({ error: "Session already completed." });
    }

    const {
      question_id,
      question_text,
      category = "Technical",
      interview_type = "technical",
      difficulty = "medium",
      student_answer,
      allow_fallback = false
    } = req.body;

    if (!question_text) {
      return res.status(422).json({ error: "question_text is required." });
    }

    // Fetch reference answer and rubric if question_id is provided
    let referenceAnswer = "";
    let evaluationRubric = "";
    if (question_id) {
      const q = await db.get("SELECT reference_answer, evaluation_rubric FROM questions WHERE id = ?", [question_id]);
      if (q) {
        referenceAnswer = q.reference_answer || "";
        evaluationRubric = q.evaluation_rubric || "";
      }
    }

    // Call AI Evaluation service
    const evalResult = await evaluateAnswer({
      questionText: question_text,
      category,
      interviewType: interview_type,
      difficulty,
      referenceAnswer,
      evaluationRubric,
      studentAnswer: student_answer || ""
    });

    if (!evalResult.success && evalResult.serviceUnavailable) {
      // If client explicitly permits fallback for offline mode
      if (allow_fallback) {
        const fallbackResult = evaluateWithLocalRubric({
          questionText: question_text,
          category,
          interviewType: interview_type,
          referenceAnswer,
          evaluationRubric,
          studentAnswer: student_answer || ""
        });
        return res.json({ evaluation: fallbackResult });
      }

      // Return explicit service unavailable error with retry capability
      return res.status(503).json({
        error: evalResult.error,
        canRetry: true,
        serviceUnavailable: true
      });
    }

    return res.json({ evaluation: evalResult });
  } catch (err) {
    console.error("[interview evaluate]", err);
    return res.status(500).json({ error: "Evaluation failed. Please try again." });
  }
});

// ── POST /api/interview/sessions/:id/answers ─────────────────
// Commit an answer (or record a skipped question) to the database
router.post(
  "/sessions/:id/answers",
  validate([
    body("question_text").notEmpty().withMessage("Question text is required.")
  ]),
  async (req, res) => {
    try {
      const userId = req.session.userId;
      const session = await db.get(
        "SELECT id, status, current_question_index FROM interview_sessions WHERE id = ? AND user_id = ?",
        [req.params.id, userId]
      );
      if (!session) return res.status(404).json({ error: "Session not found." });
      if (session.status === "completed") {
        return res.status(409).json({ error: "Session is already completed." });
      }

      const {
        question_id,
        question_text,
        question_type,
        user_answer = "",
        is_skipped = false,
        evaluation,
        input_mode = "text"
      } = req.body;

      let evalData = evaluation;

      // If no pre-computed evaluation was supplied, evaluate now
      if (!evalData) {
        if (is_skipped) {
          evalData = {
            score: 0,
            verdict: "Skipped",
            whatDidWell: "Question skipped by candidate.",
            missingPoints: "No answer was submitted for this question.",
            suggestedAnswer: "Review the topic fundamentals.",
            encouragement: "Skipping is okay during practice. Make a note to revisit this topic.",
            improvementTip: "Review the question criteria and practice an answer next time.",
            evaluationSource: "System"
          };
        } else {
          evalData = await evaluateAnswer({
            questionText: question_text,
            category: question_type || "Technical",
            interviewType: question_type || "technical",
            difficulty: "medium",
            referenceAnswer: "",
            evaluationRubric: "",
            studentAnswer: user_answer
          });

          if (!evalData.success) {
            // Fallback for saving if AI unavailable
            evalData = evaluateWithLocalRubric({
              questionText: question_text,
              category: question_type || "Technical",
              interviewType: question_type || "technical",
              studentAnswer: user_answer
            });
          }
        }
      }

      const result = await db.run(
        `INSERT INTO interview_answers
           (session_id, user_id, question_id, question_text, question_type, user_answer,
            score, verdict, what_did_well, missing_points, suggested_answer,
            improvement_tip, encouragement, evaluation_source, input_mode)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          session.id,
          userId,
          question_id || null,
          question_text,
          question_type || null,
          user_answer,
          evalData.score !== undefined ? evalData.score : null,
          evalData.verdict || null,
          evalData.whatDidWell || null,
          evalData.missingPoints || null,
          evalData.suggestedAnswer || null,
          evalData.improvementTip || null,
          evalData.encouragement || null,
          evalData.evaluationSource || "System",
          input_mode
        ]
      );

      const nextIndex = (session.current_question_index || 0) + 1;
      await db.run(
        `UPDATE interview_sessions SET current_question_index = ? WHERE id = ?`,
        [nextIndex, session.id]
      );

      return res.status(201).json({
        message: "Answer recorded successfully.",
        answerId: result.lastID,
        nextIndex,
        evaluation: evalData
      });
    } catch (err) {
      console.error("[interview answer save]", err);
      return res.status(500).json({ error: "Could not save interview answer." });
    }
  }
);

// ── PATCH /api/interview/sessions/:id/complete ───────────────
// Conclude interview session and generate aggregate performance summary
router.patch("/sessions/:id/complete", async (req, res) => {
  try {
    const userId = req.session.userId;
    const session = await db.get(
      "SELECT * FROM interview_sessions WHERE id = ? AND user_id = ?",
      [req.params.id, userId]
    );
    if (!session) return res.status(404).json({ error: "Session not found." });

    // Aggregate answers
    const answers = await db.all(
      "SELECT * FROM interview_answers WHERE session_id = ? ORDER BY id ASC",
      [session.id]
    );

    let avgScore = 0;
    if (answers.length > 0) {
      const validScores = answers.map((a) => a.score).filter((s) => s !== null && s !== undefined);
      if (validScores.length > 0) {
        avgScore = Math.round(validScores.reduce((acc, curr) => acc + curr, 0) / validScores.length);
      }
    }

    let summaryText = "";
    if (avgScore >= 85) {
      summaryText = "Strong Performance! Excellent mastery of technical depth and structured communication.";
    } else if (avgScore >= 70) {
      summaryText = "Solid Attempt! Good conceptual clarity. Focus on articulating trade-offs and edge cases.";
    } else if (avgScore >= 50) {
      summaryText = "Developing Foundation. Consistent practice on definitions and standard algorithms recommended.";
    } else {
      summaryText = "Needs Comprehensive Revision. Revisit topic fundamentals in the Question Bank.";
    }

    await db.run(
      `UPDATE interview_sessions SET
         status = 'completed',
         score = ?,
         feedback_summary = ?,
         total_questions = ?,
         completed_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')
       WHERE id = ? AND user_id = ?`,
      [avgScore, summaryText, answers.length, session.id, userId]
    );

    const updatedSession = await db.get(
      "SELECT * FROM interview_sessions WHERE id = ?",
      [session.id]
    );

    return res.json({
      message: "Session completed successfully.",
      session: updatedSession,
      answers,
      aggregateScore: avgScore,
      summary: summaryText
    });
  } catch (err) {
    console.error("[interview complete]", err);
    return res.status(500).json({ error: "Could not finalize interview session." });
  }
});

module.exports = router;
