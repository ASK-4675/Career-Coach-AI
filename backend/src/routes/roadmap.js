"use strict";

const express = require("express");
const db = require("../database/db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

// ── GET /api/roadmap ──────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const tasks = await db.all(
      "SELECT * FROM roadmap_tasks WHERE user_id=? ORDER BY week_number ASC, id ASC",
      [req.session.userId]
    );

    // Group by week
    const weeksMap = {};
    for (const task of tasks) {
      if (!weeksMap[task.week_number]) {
        weeksMap[task.week_number] = { week: task.week_number, label: task.week_label, tasks: [] };
      }
      weeksMap[task.week_number].tasks.push({
        id: task.id,
        title: task.task_title,
        type: task.task_type,
        done: task.is_done === 1
      });
    }
    return res.json({ roadmap: Object.values(weeksMap) });
  } catch (err) {
    console.error("[roadmap get]", err);
    return res.status(500).json({ error: "Could not fetch roadmap." });
  }
});

// ── POST /api/roadmap/tasks ───────────────────────────────────
router.post("/tasks", async (req, res) => {
  try {
    const { week_number, week_label, task_title, task_type } = req.body;
    if (!week_number || !task_title) {
      return res.status(422).json({ error: "week_number and task_title are required." });
    }
    const result = await db.run(
      "INSERT INTO roadmap_tasks (user_id, week_number, week_label, task_title, task_type) VALUES (?,?,?,?,?)",
      [req.session.userId, week_number, week_label || null, task_title, task_type || null]
    );
    return res.status(201).json({ taskId: result.lastID });
  } catch (err) {
    console.error("[roadmap add]", err);
    return res.status(500).json({ error: "Could not add task." });
  }
});

// ── PATCH /api/roadmap/tasks/:id/toggle ──────────────────────
router.patch("/tasks/:id/toggle", async (req, res) => {
  try {
    const userId = req.session.userId;
    const task = await db.get(
      "SELECT id, is_done FROM roadmap_tasks WHERE id=? AND user_id=?",
      [req.params.id, userId]
    );
    if (!task) return res.status(404).json({ error: "Task not found." });

    const newDone = task.is_done === 1 ? 0 : 1;
    await db.run(
      "UPDATE roadmap_tasks SET is_done=?, updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id=? AND user_id=?",
      [newDone, task.id, userId]
    );
    return res.json({ id: task.id, done: newDone === 1 });
  } catch (err) {
    console.error("[roadmap toggle]", err);
    return res.status(500).json({ error: "Could not toggle task." });
  }
});

// ── DELETE /api/roadmap/tasks/:id ────────────────────────────
router.delete("/tasks/:id", async (req, res) => {
  try {
    const result = await db.run(
      "DELETE FROM roadmap_tasks WHERE id=? AND user_id=?",
      [req.params.id, req.session.userId]
    );
    if (result.changes === 0) return res.status(404).json({ error: "Task not found." });
    return res.json({ message: "Task deleted." });
  } catch (err) {
    console.error("[roadmap delete]", err);
    return res.status(500).json({ error: "Could not delete task." });
  }
});

module.exports = router;
