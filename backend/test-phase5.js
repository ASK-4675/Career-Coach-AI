"use strict";

const BASE_URL = "http://localhost:5000/api";

async function runPhase5Tests() {
  console.log("==================================================");
  console.log("   CAREERCOACH AI - PHASE 5 VERIFICATION SUITE   ");
  console.log("==================================================");

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  function getCookie(res) {
    const setCookie = res.headers.get("set-cookie");
    if (!setCookie) return null;
    return setCookie.split(";")[0];
  }

  const timestamp = Date.now();
  const student1Email = `student1_comm_${timestamp}@nit.edu`;
  const student2Email = `student2_comm_${timestamp}@nit.edu`;
  const password = "Password123";

  // 1. Authenticate Student 1
  console.log("\n[1] Registering Student 1 Session");
  let student1Cookie = null;
  {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: student1Email,
        password: password,
        name: "Pooja Hegde",
        college: "NIT Surathkal",
        department: "Information Technology",
        department_id: "it",
        graduation_year: 2026
      })
    });
    student1Cookie = getCookie(res);
    assert(res.status === 201, "Student 1 account registered with session cookie");
  }

  // 2. Activities Catalog (All 10 activities)
  console.log("\n[2] Communication Activities Catalog (10 Modules)");
  let activitiesList = [];
  {
    const res = await fetch(`${BASE_URL}/communication/activities`, {
      headers: { Cookie: student1Cookie }
    });
    const data = await res.json();
    assert(res.status === 200, "GET /api/communication/activities returns 200");
    assert(Array.isArray(data.activities) && data.activities.length === 10, "Exactly 10 structured practice activities available");
    activitiesList = data.activities;

    // Verify presence of all 10 specific required activities
    const requiredTitles = [
      "Self-Introduction",
      "Tell Me About Yourself",
      "Explain Your Project",
      "Describe Strengths and Weaknesses",
      "Behavioral Interview Responses",
      "Group Discussion Preparation",
      "Professional Email Writing",
      "Explain a Technical Concept Simply",
      "Grammar and Vocabulary Precision",
      "Concise Answer Practice"
    ];

    for (const title of requiredTitles) {
      const found = data.activities.some((a) => a.title.toLowerCase().includes(title.toLowerCase()));
      assert(found, `Activity '${title}' verified in catalog`);
    }
  }

  // 3. Single Activity Retrieval
  console.log("\n[3] Single Activity Details & Guidelines");
  {
    const res = await fetch(`${BASE_URL}/communication/activities/self_intro`, {
      headers: { Cookie: student1Cookie }
    });
    const data = await res.json();
    assert(res.status === 200, "GET /api/communication/activities/self_intro returns 200");
    assert(data.activity && data.activity.guidelines.length >= 3, "Activity contains structured guidelines");
    assert(data.activity.sampleDraft && data.activity.sampleDraft.length > 50, "Activity provides authentic sample draft");
  }

  // 4. Draft Evaluation (Self-Introduction)
  console.log("\n[4] Draft Assessment: Self-Introduction");
  let evalSelfIntro = null;
  {
    const draft = "Hello, I am Pooja Hegde, final year IT student at NIT Surathkal. I built a distributed task scheduler in Node.js and Redis that reduced job execution lag by 35%. I am eager to contribute to your engineering backend team.";
    const res = await fetch(`${BASE_URL}/communication/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: student1Cookie },
      body: JSON.stringify({
        activity_id: "self_intro",
        user_response: draft,
        allow_fallback: true
      })
    });
    const data = await res.json();
    assert(res.status === 200, "POST /api/communication/evaluate returns 200");
    assert(data.evaluation && data.evaluation.score >= 70, `High quality draft scores well (${data.evaluation?.score}/100)`);
    assert(data.evaluation.strengths && data.evaluation.strengths.length > 5, "Includes highlighted strengths");
    assert(data.evaluation.improvements && data.evaluation.improvements.length > 5, "Includes specific improvement areas");
    assert(data.evaluation.revisedVersion && data.evaluation.revisedVersion.length > 10, "Provides polished revised version");
    assert(data.evaluation.revisionRationale && data.evaluation.revisionRationale.length > 10, "Explains why the revised version is better");
    assert(data.evaluation.followUpExercise && data.evaluation.followUpExercise.length > 5, "Provides a follow-up micro-exercise");
    assert(data.evaluation.metrics.wordCount > 0, `Measures ground-truth word count (${data.evaluation.metrics.wordCount} words)`);
    assert(data.evaluation.metrics.estimatedDeliverySeconds > 0, `Reports estimated delivery pacing (${data.evaluation.metrics.estimatedDeliverySeconds}s)`);
    evalSelfIntro = data.evaluation;
  }

  // 5. Activity Submission & Database Persistence
  console.log("\n[5] Saving Communication Submission");
  let submission1Id = null;
  {
    const draft = "Hello, I am Pooja Hegde, final year IT student at NIT Surathkal. I built a distributed task scheduler in Node.js and Redis that reduced job execution lag by 35%. I am eager to contribute to your engineering backend team.";
    const res = await fetch(`${BASE_URL}/communication/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: student1Cookie },
      body: JSON.stringify({
        activity_id: "self_intro",
        user_response: draft,
        evaluation: evalSelfIntro
      })
    });
    const data = await res.json();
    assert(res.status === 201, "POST /api/communication/submit returns 201 Created");
    assert(data.submissionId !== undefined, "Submission ID generated and saved in SQLite");
    submission1Id = data.submissionId;
  }

  // 6. Concise Answer Practice Activity Evaluation
  console.log("\n[6] Activity 10: Concise Answer Evaluation (Brevity Constraint)");
  {
    // Good concise answer: under 60 words and 2 sentences
    const conciseGood = "Automated unit and integration testing establishes an immediate feedback loop that catches regression defects before code reaches production. By verifying functional correctness deterministically on every commit, teams release updates frequently with high confidence.";
    const resGood = await fetch(`${BASE_URL}/communication/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: student1Cookie },
      body: JSON.stringify({
        activity_id: "concise_answer",
        user_response: conciseGood,
        allow_fallback: true
      })
    });
    const dataGood = await resGood.json();
    assert(dataGood.evaluation.scores.conciseness >= 90, `Concise answer receives high conciseness score (${dataGood.evaluation.scores.conciseness}/100)`);

    // Submit second activity to history
    await fetch(`${BASE_URL}/communication/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: student1Cookie },
      body: JSON.stringify({
        activity_id: "concise_answer",
        user_response: conciseGood,
        evaluation: dataGood.evaluation
      })
    });
  }

  // 7. Grammar and Informal Phrasing Flagging
  console.log("\n[7] Activity 9: Grammar & Vocabulary Assessment");
  {
    const informalDraft = "Me and my friends we done lots of coding stuff and fixed it super fast.";
    const res = await fetch(`${BASE_URL}/communication/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: student1Cookie },
      body: JSON.stringify({
        activity_id: "grammar_vocab",
        user_response: informalDraft,
        allow_fallback: true
      })
    });
    const data = await res.json();
    assert(data.evaluation.scores.grammar < 75, `Grammar errors penalized constructively (${data.evaluation.scores.grammar}/100)`);
    assert(data.evaluation.revisedVersion.includes("my team and I") || data.evaluation.revisedVersion.includes("developed"), "Revised version replaces 'me and my' with formal construction");
  }

  // 8. User History & Progress Tracking
  console.log("\n[8] History Tracking & Changes Over Time");
  {
    const resHist = await fetch(`${BASE_URL}/communication/history`, {
      headers: { Cookie: student1Cookie }
    });
    const dataHist = await resHist.json();
    assert(resHist.status === 200, "GET /api/communication/history returns 200");
    assert(Array.isArray(dataHist.submissions) && dataHist.submissions.length >= 2, "Student 1 past attempts recorded in SQLite");
    assert(dataHist.submissions[0].activity_title !== undefined, "Submission records activity title");

    // Check stats progression
    const resStats = await fetch(`${BASE_URL}/communication/stats`, {
      headers: { Cookie: student1Cookie }
    });
    const dataStats = await resStats.json();
    assert(resStats.status === 200, "GET /api/communication/stats returns 200");
    assert(dataStats.stats.totalAttempts >= 2, `Total attempts tracked (${dataStats.stats.totalAttempts})`);
    assert(dataStats.stats.uniqueActivitiesCompleted >= 2, "Unique activities completed tracked");
    assert(Array.isArray(dataStats.trend) && dataStats.trend.length >= 2, "Chronological score trend returned for progress charting");
  }

  // 9. Cross-User Data Isolation
  console.log("\n[9] Cross-User Submission Isolation");
  {
    // Register Student 2
    const resReg2 = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: student2Email,
        password: password,
        name: "Rahul Verma",
        college: "IIT Bombay",
        department: "Computer Science Engineering",
        graduation_year: 2025
      })
    });
    const student2Cookie = getCookie(resReg2);

    // Student 2 fetches history -> Should be 0 submissions
    const resHist2 = await fetch(`${BASE_URL}/communication/history`, {
      headers: { Cookie: student2Cookie }
    });
    const dataHist2 = await resHist2.json();
    assert(dataHist2.submissions.length === 0, "Student 2 sees 0 submissions (User data isolation verified)");
  }

  // 10. Validation & Error Handling
  console.log("\n[10] Input Validation & Error Handling");
  {
    // Empty submission -> Expect 422
    const resEmpty = await fetch(`${BASE_URL}/communication/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: student1Cookie },
      body: JSON.stringify({
        activity_id: "self_intro",
        user_response: ""
      })
    });
    assert(resEmpty.status === 422, "Empty submission rejected with 422 Unprocessable Entity");

    // Invalid activity_id -> Expect 404
    const resBadId = await fetch(`${BASE_URL}/communication/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: student1Cookie },
      body: JSON.stringify({
        activity_id: "non_existent_activity_id",
        user_response: "Valid text response"
      })
    });
    assert(resBadId.status === 404, "Invalid activity ID returns 404 Not Found");
  }

  console.log("\n==================================================");
  console.log(`PHASE 5 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase5Tests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
