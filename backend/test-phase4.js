"use strict";

const BASE_URL = "http://localhost:5000/api";

async function runPhase4Tests() {
  console.log("==================================================");
  console.log("   CAREERCOACH AI - PHASE 4 VERIFICATION SUITE   ");
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
  const studentEmail = `student_phase4_${timestamp}@nit.edu`;
  const student2Email = `student2_phase4_${timestamp}@nit.edu`;
  const password = "Password123";

  // 1. Authenticate user for interview tests
  console.log("\n[1] Registering Student Session");
  let studentCookie = null;
  {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: studentEmail,
        password: password,
        name: "Vikram Raman",
        college: "NIT Trichy",
        department: "Mechanical Engineering",
        department_id: "mech",
        graduation_year: 2026
      })
    });
    studentCookie = getCookie(res);
    assert(res.status === 201, "Student account created successfully");
  }

  // 2. Question Bank Querying
  console.log("\n[2] Question Bank Catalog & Department Filters");
  {
    // All questions
    const resAll = await fetch(`${BASE_URL}/questions`);
    const dataAll = await resAll.json();
    assert(resAll.status === 200, "GET /api/questions returns 200");
    assert(dataAll.total >= 20, `Total questions loaded (${dataAll.total} questions)`);

    // Department-specific: Mechanical
    const resMech = await fetch(`${BASE_URL}/questions?department_id=mech`);
    const dataMech = await resMech.json();
    assert(dataMech.questions.length >= 2, "Mechanical department questions filtered successfully");
    assert(dataMech.questions.some((q) => q.question_text.includes("Carnot") || q.category.includes("Mechanical")), "Carnot Cycle question present in Mechanical filter");

    // Department-specific: Biomedical
    const resBio = await fetch(`${BASE_URL}/questions?department_id=biomedical`);
    const dataBio = await resBio.json();
    assert(dataBio.questions.some((q) => q.question_text.includes("ECG")), "Biomedical ECG question found");

    // Department-specific: ECE & EEE
    const resEce = await fetch(`${BASE_URL}/questions?department_id=ece`);
    const dataEce = await resEce.json();
    assert(dataEce.questions.some((q) => q.question_text.includes("Nyquist") || q.question_text.includes("Setup")), "ECE Nyquist/VLSI questions found");

    // Category filter: Programming & DSA
    const resDsa = await fetch(`${BASE_URL}/questions?category=Programming%20%26%20DSA`);
    const dataDsa = await resDsa.json();
    assert(dataDsa.questions.length >= 2, "Programming & DSA questions filtered");

    // Keyword search
    const resSearch = await fetch(`${BASE_URL}/questions?search=React`);
    const dataSearch = await resSearch.json();
    assert(dataSearch.questions.some((q) => q.question_text.includes("React") || q.reference_answer.includes("React")), "Search keyword 'React' matches questions");
  }

  // 3. Start Configured Interview Session
  console.log("\n[3] Interview Configuration & Session Initiation");
  let sessionId = null;
  let sessionQuestions = [];
  {
    const resStart = await fetch(`${BASE_URL}/interview/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: studentCookie },
      body: JSON.stringify({
        role_id: "software-developer",
        interview_type: "mixed",
        difficulty: "medium",
        question_count: 3
      })
    });
    const dataStart = await resStart.json();
    assert(resStart.status === 201, "POST /api/interview/sessions creates new session (201)");
    assert(dataStart.session && dataStart.session.id !== undefined, "Session ID generated");
    assert(Array.isArray(dataStart.questions) && dataStart.questions.length === 3, "Exactly 3 questions selected for session");
    sessionId = dataStart.session.id;
    sessionQuestions = dataStart.questions;
  }

  // 4. Test Correct Answer Evaluation
  console.log("\n[4] Correct Technical Answer Evaluation");
  {
    const q1 = sessionQuestions[0];
    const goodAnswer = q1.reference_answer ||
      "We solve this using a Hash Map in a single pass. For each element x, we compute complement = target - x. If complement is in the map, return indices. Time complexity is O(n) and auxiliary space complexity is O(n).";

    const resEval = await fetch(`${BASE_URL}/interview/sessions/${sessionId}/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: studentCookie },
      body: JSON.stringify({
        question_id: q1.id,
        question_text: q1.question_text,
        category: q1.category,
        interview_type: q1.interview_type,
        difficulty: q1.difficulty,
        student_answer: goodAnswer,
        allow_fallback: true
      })
    });
    const dataEval = await resEval.json();
    assert(resEval.status === 200, "Evaluation endpoint returns 200");
    assert(dataEval.evaluation && dataEval.evaluation.score >= 70, `Correct answer receives high score (${dataEval.evaluation?.score}/100)`);
    assert(dataEval.evaluation.whatDidWell && dataEval.evaluation.whatDidWell.length > 5, "Includes positive feedback ('whatDidWell')");
    assert(dataEval.evaluation.improvementTip && dataEval.evaluation.improvementTip.length > 5, "Includes actionable improvement tip");
  }

  // 5. Test Partially Correct Answer Evaluation
  console.log("\n[5] Partially Correct Answer Evaluation");
  {
    const q1 = sessionQuestions[0];
    const partialAnswer = "You use a loop to check the numbers and use some data structure to store them.";

    const resEval = await fetch(`${BASE_URL}/interview/sessions/${sessionId}/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: studentCookie },
      body: JSON.stringify({
        question_id: q1.id,
        question_text: q1.question_text,
        category: q1.category,
        interview_type: q1.interview_type,
        difficulty: q1.difficulty,
        student_answer: partialAnswer,
        allow_fallback: true
      })
    });
    const dataEval = await resEval.json();
    assert(resEval.status === 200, "Partial answer evaluated");
    assert(dataEval.evaluation.score >= 35 && dataEval.evaluation.score <= 75, `Partial answer receives proportionate score (${dataEval.evaluation.score}/100)`);
    assert(dataEval.evaluation.missingPoints && dataEval.evaluation.missingPoints.length > 5, "Identifies missing points without false praise");
  }

  // 6. Test Incorrect Answer Evaluation
  console.log("\n[6] Incorrect Technical Answer Evaluation");
  {
    const q1 = sessionQuestions[0];
    const wrongAnswer = "We don't need any algorithms or data structures, you just multiply all the numbers together and return 0.";

    const resEval = await fetch(`${BASE_URL}/interview/sessions/${sessionId}/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: studentCookie },
      body: JSON.stringify({
        question_id: q1.id,
        question_text: q1.question_text,
        category: q1.category,
        interview_type: q1.interview_type,
        difficulty: q1.difficulty,
        student_answer: wrongAnswer,
        allow_fallback: true
      })
    });
    const dataEval = await resEval.json();
    assert(resEval.status === 200, "Incorrect answer evaluated");
    assert(dataEval.evaluation.score <= 35, `Incorrect answer receives low score (${dataEval.evaluation.score}/100)`);
    assert(dataEval.evaluation.verdict === "Unsatisfactory" || dataEval.evaluation.verdict === "Needs Improvement", "Verdict reflects shortfall honestly");
  }

  // 7. Test Empty Answer Evaluation
  console.log("\n[7] Empty / Blank Answer Evaluation");
  {
    const q1 = sessionQuestions[0];
    const resEval = await fetch(`${BASE_URL}/interview/sessions/${sessionId}/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: studentCookie },
      body: JSON.stringify({
        question_id: q1.id,
        question_text: q1.question_text,
        student_answer: "   ",
        allow_fallback: true
      })
    });
    const dataEval = await resEval.json();
    assert(dataEval.evaluation.score === 0, "Empty answer receives score of 0");
    assert(dataEval.evaluation.verdict.toLowerCase().includes("no answer") || dataEval.evaluation.verdict.toLowerCase().includes("unsatisfactory"), "Verdict notes no answer provided");
  }

  // 8. Test Off-Topic Answer Evaluation
  console.log("\n[8] Off-Topic Answer Evaluation");
  {
    const q1 = sessionQuestions[0];
    const offTopic = "My favorite food is Italian pizza with cheese and I like sunny weather during summer holidays.";

    const resEval = await fetch(`${BASE_URL}/interview/sessions/${sessionId}/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: studentCookie },
      body: JSON.stringify({
        question_id: q1.id,
        question_text: q1.question_text,
        student_answer: offTopic,
        allow_fallback: true
      })
    });
    const dataEval = await resEval.json();
    assert(dataEval.evaluation.score <= 25, `Off-topic answer flagged with low score (${dataEval.evaluation.score}/100)`);
    assert(dataEval.evaluation.missingPoints.toLowerCase().includes("off-topic") || dataEval.evaluation.missingPoints.toLowerCase().includes("unrelated"), "Feedback identifies off-topic nature");
  }

  // 9. AI Service Unavailability & Retry Capability
  console.log("\n[9] AI Service Failure & Retry Response");
  {
    const q1 = sessionQuestions[0];
    // When allow_fallback is false and no API key is present, backend must return 503 with canRetry: true
    const resServiceCheck = await fetch(`${BASE_URL}/interview/sessions/${sessionId}/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: studentCookie },
      body: JSON.stringify({
        question_id: q1.id,
        question_text: q1.question_text,
        student_answer: "Valid technical answer text",
        allow_fallback: false
      })
    });
    const dataService = await resServiceCheck.json();
    if (resServiceCheck.status === 503) {
      assert(dataService.canRetry === true, "503 response includes canRetry: true for user retry");
      assert(dataService.error && dataService.error.length > 0, "Friendly error message explaining AI availability returned");
    } else {
      // If an API key happened to be active in environment
      assert(resServiceCheck.status === 200, "Active API key handled successfully");
    }
  }

  // 10. Answer Commitment, Question Skipping, and Session Progression
  console.log("\n[10] Full Interview Session Progression");
  {
    // Question 1: Answer committed with high quality
    const q1 = sessionQuestions[0];
    const resAns1 = await fetch(`${BASE_URL}/interview/sessions/${sessionId}/answers`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: studentCookie },
      body: JSON.stringify({
        question_id: q1.id,
        question_text: q1.question_text,
        question_type: q1.category,
        user_answer: q1.reference_answer || "Hash table approach with O(n) time and O(n) space.",
        is_skipped: false,
        evaluation: {
          score: 88,
          verdict: "Strong Hire",
          whatDidWell: "Comprehensive algorithmic analysis with exact time and space complexity.",
          missingPoints: "Consider edge cases with empty array.",
          suggestedAnswer: q1.reference_answer,
          encouragement: "Excellent engineering precision!",
          improvementTip: "State edge cases first."
        }
      })
    });
    const dataAns1 = await resAns1.json();
    assert(resAns1.status === 201, "Answer 1 recorded (201 Created)");
    assert(dataAns1.nextIndex === 1, "Session counter advanced to question index 1");

    // Question 2: Skipped question
    const q2 = sessionQuestions[1];
    const resAns2 = await fetch(`${BASE_URL}/interview/sessions/${sessionId}/answers`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: studentCookie },
      body: JSON.stringify({
        question_id: q2.id,
        question_text: q2.question_text,
        question_type: q2.category,
        is_skipped: true
      })
    });
    assert(resAns2.status === 201, "Skipped question recorded gracefully");

    // Question 3: Answer committed with medium quality
    const q3 = sessionQuestions[2];
    const resAns3 = await fetch(`${BASE_URL}/interview/sessions/${sessionId}/answers`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: studentCookie },
      body: JSON.stringify({
        question_id: q3.id,
        question_text: q3.question_text,
        question_type: q3.category,
        user_answer: "STAR method: handled team conflict through open discussion.",
        is_skipped: false,
        evaluation: {
          score: 75,
          verdict: "Hire",
          whatDidWell: "Good STAR framework awareness.",
          missingPoints: "Add quantitative metric of success.",
          suggestedAnswer: "In our project we scheduled a technical review...",
          encouragement: "Good communication clarity.",
          improvementTip: "Mention the final project delivery timeline."
        }
      })
    });
    assert(resAns3.status === 201, "Answer 3 recorded");
  }

  // 11. Final Session Conclusion & Score Aggregation
  console.log("\n[11] Session Conclusion & Final Report");
  {
    const resComplete = await fetch(`${BASE_URL}/interview/sessions/${sessionId}/complete`, {
      method: "PATCH",
      headers: { Cookie: studentCookie }
    });
    const dataComplete = await resComplete.json();
    assert(resComplete.status === 200, "PATCH /api/interview/sessions/:id/complete returns 200");
    assert(dataComplete.session.status === "completed", "Session status updated to 'completed'");
    assert(dataComplete.session.score > 0, `Aggregate score computed (${dataComplete.session.score}%)`);
    assert(dataComplete.answers.length === 3, "All 3 answers recorded in database report");
  }

  // 12. Cross-User Data Isolation Verification
  console.log("\n[12] Cross-User Session Isolation");
  {
    // Register Student 2
    const resReg2 = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: student2Email,
        password: password,
        name: "Neha Gupta",
        college: "IIT Delhi",
        department: "Computer Science Engineering",
        graduation_year: 2025
      })
    });
    const student2Cookie = getCookie(resReg2);

    // Student 2 tries to access Student 1's interview session -> Expect 404
    const resCrossAccess = await fetch(`${BASE_URL}/interview/sessions/${sessionId}`, {
      headers: { Cookie: student2Cookie }
    });
    assert(resCrossAccess.status === 404, "Student 2 CANNOT access Student 1's interview session (404 Not Found - Data Isolated)");
  }

  console.log("\n==================================================");
  console.log(`PHASE 4 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase4Tests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
