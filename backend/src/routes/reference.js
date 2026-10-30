"use strict";

const express = require("express");
const db = require("../database/db");

const departmentsRouter = express.Router();
departmentsRouter.get("/", (_req, res) => {
  return res.json({
    departments: [
      { id: "cse",        code: "CSE",     name: "Computer Science Engineering" },
      { id: "it",         code: "IT",      name: "Information Technology" },
      { id: "aids",       code: "AI & DS", name: "Artificial Intelligence and Data Science" },
      { id: "mech",       code: "MECH",    name: "Mechanical Engineering" },
      { id: "biomedical", code: "BME",     name: "Biomedical Engineering" },
      { id: "ece",        code: "ECE",     name: "Electronics and Communication Engineering" },
      { id: "eee",        code: "EEE",     name: "Electrical and Electronics Engineering" },
      { id: "civil",      code: "CIVIL",   name: "Civil Engineering" },
      { id: "other",      code: "OTHER",   name: "Other Engineering" }
    ]
  });
});

const careerRolesRouter = express.Router();
careerRolesRouter.get("/", async (_req, res) => {
  try {
    const rows = await db.all("SELECT * FROM career_roles ORDER BY category, title");
    const roles = rows.map((r) => ({
      ...r,
      recommended_depts: safeJsonParse(r.recommended_depts, []),
      core_skills: safeJsonParse(r.core_skills, [])
    }));
    return res.json({ roles });
  } catch (err) {
    console.error("[career-roles]", err);
    return res.status(500).json({ error: "Could not fetch career roles." });
  }
});

function safeJsonParse(str, fallback) {
  try { return JSON.parse(str); } catch { return fallback; }
}

module.exports = { departmentsRouter, careerRolesRouter };
