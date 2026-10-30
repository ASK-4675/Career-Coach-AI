"use strict";

const BASE_URL = "http://localhost:5000/api";

async function runPhase6Tests() {
  console.log("==================================================");
  console.log("   CAREERCOACH AI - PHASE 6 VERIFICATION SUITE   ");
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
  const studentEmail = `video_student_${timestamp}@engineering.edu`;
  const student2Email = `video_student2_${timestamp}@engineering.edu`;
  const password = "Password123";

  // 1. Authenticate user for interview tests
  console.log("\n[1] Registering Student Session for Voice/Video Interview");
  let studentCookie = null;
  {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: studentEmail,
        password: password,
        name: "Kiran Patel",
        college: "IIT Madras",
        department: "Computer Science Engineering (CSE)",
        department_id: "cse",
        graduation_year: 2026
      })
    });
    studentCookie = getCookie(res);
    assert(res.status === 201, "Student account created successfully");
  }

  // 2. Video mock interview session configuration
  console.log("\n[2] Video Mock Interview Session Initiation (Immediate Feedback)");
  let session1Id = null;
  {
    const res = await fetch(`${BASE_URL}/interview/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: studentCookie
      },
      body: JSON.stringify({
        role_id: "full-stack-developer",
        difficulty: "medium",
        interview_type: "mixed",
        question_count: 2,
        interview_mode: "video",
        feedback_mode: "immediate"
      })
    });
    const data = await res.json();
    assert(res.status === 201, "Video session created successfully (201)");
    assert(data.session?.interview_mode === "video", "Session interview_mode stored as 'video'");
    assert(data.session?.feedback_mode === "immediate", "Session feedback_mode stored as 'immediate'");
    assert(data.questions?.length === 2, "Configured question count matches requested 2 questions");
    session1Id = data.session?.id;
  }

  // 3. Reject invalid modes
  console.log("\n[3] Input Validation: Invalid Modes");
  {
    const resInvalidMode = await fetch(`${BASE_URL}/interview/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: studentCookie
      },
      body: JSON.stringify({
        role_id: "full-stack-developer",
        interview_mode: "telepathic"
      })
    });
    assert(resInvalidMode.status === 422, "Invalid interview_mode rejected with 422 Unprocessable Entity");

    const resInvalidFeedback = await fetch(`${BASE_URL}/interview/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: studentCookie
      },
      body: JSON.stringify({
        role_id: "full-stack-developer",
        feedback_mode: "never_feedback"
      })
    });
    assert(resInvalidFeedback.status === 422, "Invalid feedback_mode rejected with 422 Unprocessable Entity");
  }

  // 4. Voice-only session with realistic mock (end_of_interview)
  console.log("\n[4] Voice-Only Session with Realistic Mock (End-of-Interview Review)");
  let session2Id = null;
  let session2Questions = [];
  {
    const res = await fetch(`${BASE_URL}/interview/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: studentCookie
      },
      body: JSON.stringify({
        role_id: "software-developer",
        difficulty: "hard",
        interview_type: "technical",
        question_count: 2,
        interview_mode: "voice",
        feedback_mode: "end_of_interview"
      })
    });
    const data = await res.json();
    assert(res.status === 201, "Voice session created successfully (201)");
    assert(data.session?.interview_mode === "voice", "Session interview_mode stored as 'voice'");
    assert(data.session?.feedback_mode === "end_of_interview", "Session feedback_mode stored as 'end_of_interview'");
    session2Id = data.session?.id;
    session2Questions = data.questions || [];
  }

  // 5. Answer recording with input_mode='voice' and input_mode='voice_edited'
  console.log("\n[5] Answer Recording with Voice Input Modes");
  {
    const q1 = session2Questions[0];
    const res1 = await fetch(`${BASE_URL}/interview/sessions/${session2Id}/answers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: studentCookie
      },
      body: JSON.stringify({
        question_id: q1?.id,
        question_text: q1?.question_text || "Explain dependency injection.",
        question_type: q1?.category || "Technical",
        user_answer: "I structure this with dependency inversion, decoupling services, and unit testing every interface layer.",
        input_mode: "voice"
      })
    });
    assert(res1.status === 201, "Answer 1 recorded with input_mode='voice'");

    const q2 = session2Questions[1];
    const res2 = await fetch(`${BASE_URL}/interview/sessions/${session2Id}/answers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: studentCookie
      },
      body: JSON.stringify({
        question_id: q2?.id,
        question_text: q2?.question_text || "Explain database indexing.",
        question_type: q2?.category || "Technical",
        user_answer: "We deploy using containerized Docker images and blue-green releases to guarantee zero downtime during traffic peaks.",
        input_mode: "voice_edited"
      })
    });
    assert(res2.status === 201, "Answer 2 recorded with input_mode='voice_edited'");
  }

  // 6. Finalize session and verify aggregate calculation & answer preservation
  console.log("\n[6] End-of-Interview Realistic Review Finalization");
  {
    const res = await fetch(`${BASE_URL}/interview/sessions/${session2Id}/complete`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: studentCookie
      },
      body: JSON.stringify({})
    });
    const data = await res.json();
    assert(res.status === 200, "Session finalized with complete status (200)");
    assert(data.session?.status === "completed", "Status is marked as completed in DB");
    assert(typeof data.aggregateScore === "number", "Aggregate score computed");
    assert(data.answers?.length === 2, "Report includes all 2 evaluated answers");
  }

  // 7. Inspect session and verify input_mode persistence
  console.log("\n[7] Session Inspection & Input Mode Persistence");
  {
    const res = await fetch(`${BASE_URL}/interview/sessions/${session2Id}`, {
      headers: { Cookie: studentCookie }
    });
    const data = await res.json();
    assert(res.status === 200, "GET /api/interview/sessions/:id returns 200");
    assert(data.session?.interview_mode === "voice", "Retrieved session preserves interview_mode='voice'");
    assert(data.session?.feedback_mode === "end_of_interview", "Retrieved session preserves feedback_mode='end_of_interview'");

    const ans1 = data.answers.find((a) => a.input_mode === "voice");
    assert(ans1 && ans1.input_mode === "voice", "First answer input_mode='voice' preserved in SQLite");

    const ans2 = data.answers.find((a) => a.input_mode === "voice_edited");
    assert(ans2 && ans2.input_mode === "voice_edited", "Second answer input_mode='voice_edited' preserved in SQLite");
  }

  // 8. Privacy & Cross-User Session Isolation
  console.log("\n[8] Privacy & Cross-User Session Isolation");
  {
    const resReg2 = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: student2Email,
        password: password,
        name: "Sneha Reddy",
        college: "BITS Pilani",
        department: "Information Technology (IT)",
        department_id: "it",
        graduation_year: 2026
      })
    });
    const cookie2 = getCookie(resReg2);

    const unauthorizedRes = await fetch(`${BASE_URL}/interview/sessions/${session2Id}`, {
      headers: { Cookie: cookie2 }
    });
    assert(
      unauthorizedRes.status === 404,
      "Second user CANNOT access student 1's mock interview video/voice session (404 Isolated)"
    );
  }

  console.log("\n==================================================");
  console.log(`PHASE 6 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================\n");

  if (failed > 0) process.exit(1);
}

runPhase6Tests().catch((err) => {
  console.error("Test runner error:", err);
  process.exit(1);
});
