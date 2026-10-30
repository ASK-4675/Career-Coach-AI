"use strict";

const BASE_URL = "http://localhost:5000/api";

async function runTests() {
  console.log("==================================================");
  console.log("   CAREERCOACH AI - PHASE 3 BACKEND TEST SUITE    ");
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

  // Helper to extract cookie from Set-Cookie header
  function getCookie(res) {
    const setCookie = res.headers.get("set-cookie");
    if (!setCookie) return null;
    return setCookie.split(";")[0];
  }

  const timestamp = Date.now();
  const user1Email = `student1_${timestamp}@nit.edu`;
  const user2Email = `student2_${timestamp}@nit.edu`;
  const password = "ValidPassword123";

  // 1. Health check
  console.log("\n[1] Health Check Endpoint");
  {
    const res = await fetch(`${BASE_URL}/health`);
    const data = await res.json();
    assert(res.status === 200, "GET /api/health returns 200");
    assert(data.status === "ok", "GET /api/health returns status 'ok'");
  }

  // 2. Reference Endpoints (Public)
  console.log("\n[2] Reference Data Endpoints");
  {
    const resDepts = await fetch(`${BASE_URL}/departments`);
    const deptsData = await resDepts.json();
    assert(resDepts.status === 200, "GET /api/departments returns 200");
    assert(Array.isArray(deptsData.departments) && deptsData.departments.length >= 8, `Departments returned (${deptsData.departments?.length} items)`);

    const resRoles = await fetch(`${BASE_URL}/career-roles`);
    const rolesData = await resRoles.json();
    assert(resRoles.status === 200, "GET /api/career-roles returns 200");
    assert(Array.isArray(rolesData.roles) && rolesData.roles.length >= 20, `Career roles returned (${rolesData.roles?.length} items)`);
  }

  // 3. Registration Validation
  console.log("\n[3] Registration Validation & Password Rules");
  {
    // Weak password
    const resWeak = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "bad@test.com", password: "short", name: "Bad Password" })
    });
    assert(resWeak.status === 422, "Weak password rejected with 422 Unprocessable Entity");

    // Invalid email
    const resInvalidEmail = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "not-an-email", password: "Password123", name: "Bad Email" })
    });
    assert(resInvalidEmail.status === 422, "Invalid email format rejected with 422");
  }

  // 4. Successful Registration & Session Creation
  console.log("\n[4] User 1 Registration & Auto-Session");
  let user1Cookie = null;
  {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user1Email,
        password: password,
        name: "Arun Kumar",
        college: "NIT Trichy",
        department: "Computer Science and Engineering",
        department_id: "cse",
        graduation_year: 2026
      })
    });
    const data = await res.json();
    user1Cookie = getCookie(res);
    assert(res.status === 201, "Registration returns 201 Created");
    assert(data.user && data.user.email === user1Email, "Returns user email");
    assert(user1Cookie && user1Cookie.includes("careercoach.sid"), "Session cookie 'careercoach.sid' returned");
  }

  // 5. Duplicate Email Conflict (409)
  console.log("\n[5] Duplicate Registration Prevention");
  {
    const resDup = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user1Email,
        password: password,
        name: "Duplicate User"
      })
    });
    assert(resDup.status === 409, "Duplicate registration rejected with 409 Conflict");
  }

  // 6. Session Persistence & /api/auth/me
  console.log("\n[6] Session Persistence via Cookie");
  {
    const resMe = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Cookie: user1Cookie }
    });
    const dataMe = await resMe.json();
    assert(resMe.status === 200, "GET /api/auth/me returns 200 with valid session cookie");
    assert(dataMe.user && dataMe.user.email === user1Email, "Authenticated user matches user1");

    // Without cookie -> 401
    const resNoAuth = await fetch(`${BASE_URL}/auth/me`);
    assert(resNoAuth.status === 401, "GET /api/auth/me rejected with 401 when no session provided");
  }

  // 7. Authentication Failure Scenarios
  console.log("\n[7] Authentication Failure Scenarios");
  {
    const resWrongPass = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user1Email, password: "WrongPassword999" })
    });
    assert(resWrongPass.status === 401, "Invalid password returns 401 Unauthorized");

    const resNonExistent = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "nobody@example.com", password: "Password123" })
    });
    assert(resNonExistent.status === 401, "Non-existent user returns 401 Unauthorized");
  }

  // 8. Explicit Login
  console.log("\n[8] User 1 Login");
  {
    const resLogin = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user1Email, password: password })
    });
    const dataLogin = await resLogin.json();
    user1Cookie = getCookie(resLogin); // updated session
    assert(resLogin.status === 200, "Valid login returns 200 OK");
    assert(dataLogin.user.name === "Arun Kumar", "User name returned correctly");
  }

  // 9. Profile Management (GET & PUT)
  console.log("\n[9] Profile Retrieval & Update");
  {
    const resProf = await fetch(`${BASE_URL}/profile`, {
      headers: { Cookie: user1Cookie }
    });
    const dataProf = await resProf.json();
    assert(resProf.status === 200, "GET /api/profile returns 200");
    assert(dataProf.profile.full_name === "Arun Kumar", "Initial profile name is Arun Kumar");

    // Update profile
    const resUpdate = await fetch(`${BASE_URL}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: user1Cookie
      },
      body: JSON.stringify({
        full_name: "Arun Kumar R",
        college: "NIT Trichy",
        degree: "B.Tech Computer Science",
        department_id: "cse",
        department_name: "Computer Science and Engineering",
        current_year: 4,
        graduation_year: 2026,
        target_role_id: "aiml-engineer",
        target_role_name: "AI/ML Engineer",
        difficulty_level: "hard",
        skills: ["Python", "PyTorch", "Docker", "SQL"],
        bio: "Aspiring AI Engineer specializing in LLMs"
      })
    });
    const dataUpdate = await resUpdate.json();
    assert(resUpdate.status === 200, "PUT /api/profile returns 200");
    assert(dataUpdate.profile.full_name === "Arun Kumar R", "Profile name updated to 'Arun Kumar R'");
    assert(dataUpdate.profile.target_role_id === "aiml-engineer", "Target role updated to aiml-engineer");
    assert(Array.isArray(dataUpdate.profile.skills) && dataUpdate.profile.skills.length === 4, "Skills array saved and parsed correctly");
  }

  // 10. Dashboard Summary Endpoint
  console.log("\n[10] Dashboard Summary");
  {
    const resDash = await fetch(`${BASE_URL}/dashboard`, {
      headers: { Cookie: user1Cookie }
    });
    const dataDash = await resDash.json();
    assert(resDash.status === 200, "GET /api/dashboard returns 200");
    assert(dataDash.profile !== undefined, "Dashboard contains student profile");
    assert(dataDash.interviews !== undefined, "Dashboard contains interviews object");
    assert(dataDash.interviews.completed === 0, "Initial completed sessions is 0");
    assert(dataDash.roadmap !== undefined, "Dashboard contains roadmap stats");
  }

  // 11. User 2 Registration & Cross-User Isolation
  console.log("\n[11] Cross-User Data Isolation");
  let user2Cookie = null;
  {
    const res2 = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user2Email,
        password: password,
        name: "Divya Sharma",
        college: "IIT Madras",
        department: "Electrical and Electronics Engineering",
        department_id: "eee",
        graduation_year: 2025
      })
    });
    user2Cookie = getCookie(res2);
    assert(res2.status === 201, "User 2 registered successfully");

    // Fetch User 2 profile with User 2 session
    const resProf2 = await fetch(`${BASE_URL}/profile`, {
      headers: { Cookie: user2Cookie }
    });
    const dataProf2 = await resProf2.json();
    assert(dataProf2.profile.full_name === "Divya Sharma", "User 2 sees their own profile (Divya Sharma)");

    // Fetch User 1 profile with User 1 session
    const resProf1 = await fetch(`${BASE_URL}/profile`, {
      headers: { Cookie: user1Cookie }
    });
    const dataProf1 = await resProf1.json();
    assert(dataProf1.profile.full_name === "Arun Kumar R", "User 1 sees their own profile (Arun Kumar R)");
    assert(dataProf1.profile.user_id !== dataProf2.profile.user_id, "User 1 and User 2 have distinct user_ids");
  }

  // 12. Roadmap Tasks & User Scoping
  console.log("\n[12] Roadmap Tasks & Scoping");
  {
    // User 1 creates a task
    const resTask1 = await fetch(`${BASE_URL}/roadmap/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: user1Cookie },
      body: JSON.stringify({
        week_number: 1,
        week_label: "Foundation",
        task_title: "Master PyTorch Basics",
        task_type: "Technical"
      })
    });
    assert(resTask1.status === 201, "User 1 created a roadmap task");

    // User 1 lists tasks
    const resList1 = await fetch(`${BASE_URL}/roadmap`, {
      headers: { Cookie: user1Cookie }
    });
    const dataList1 = await resList1.json();
    assert(Array.isArray(dataList1.roadmap) && dataList1.roadmap.length === 1, "User 1 sees 1 roadmap week");
    assert(dataList1.roadmap[0].tasks.length === 1, "User 1 sees 1 task under week 1");

    // User 2 lists tasks -> should see 0 weeks/tasks (isolation verified!)
    const resList2 = await fetch(`${BASE_URL}/roadmap`, {
      headers: { Cookie: user2Cookie }
    });
    const dataList2 = await resList2.json();
    assert(Array.isArray(dataList2.roadmap) && dataList2.roadmap.length === 0, "User 2 sees 0 roadmap weeks (cross-user data isolation verified)");
  }

  // 13. Logout & Session Termination
  console.log("\n[13] Logout & Session Invalidation");
  {
    const resLogout = await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      headers: { Cookie: user1Cookie }
    });
    assert(resLogout.status === 200, "POST /api/auth/logout returns 200 OK");

    // After logout, /auth/me must return 401
    const resMeAfter = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Cookie: user1Cookie }
    });
    assert(resMeAfter.status === 401, "Accessing /api/auth/me after logout correctly rejected with 401");
  }

  console.log("\n==================================================");
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
