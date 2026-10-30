import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  UploadCloud,
  FileText,
  Trash2,
  Plus,
  Briefcase,
  GraduationCap,
  Globe,
  Link2,
  Layers,
  Shuffle,
  AlertCircle,
  Building2,
  BookOpen
} from "lucide-react";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { useApp } from "../context/AppContext";

export const ProfileSetupPage = () => {
  const {
    student,
    updateStudentProfile,
    departments,
    careerRoles,
    validateStudentProfile,
    showToast
  } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");

  // Form states covering all required fields
  const [name, setName] = useState(student.name || "Aarav Sharma");
  const [college, setCollege] = useState(student.college || "National Institute of Technology");
  const [degree, setDegree] = useState(student.degree || "B.Tech in Computer Science & Engineering");
  const [departmentId, setDepartmentId] = useState(student.departmentId || "cse");
  const [currentYear, setCurrentYear] = useState(student.currentYear || "4th Year (Final Year)");
  const [graduationYear, setGraduationYear] = useState(student.graduationYear || "2026");
  const [cgpa, setCgpa] = useState(student.cgpa || "8.85");

  const [targetRoleId, setTargetRoleId] = useState(student.targetRoleId || "full-stack-developer");
  const [difficultyLevel, setDifficultyLevel] = useState(student.difficultyLevel || "Intermediate");
  const [targetTier, setTargetTier] = useState(student.targetTier || "Tier 1 Product Companies");

  const [skills, setSkills] = useState(student.skills || ["JavaScript", "React", "Node.js", "Java", "SQL"]);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [github, setGithub] = useState(student.github || "https://github.com/aaravsharma-dev");
  const [linkedin, setLinkedin] = useState(student.linkedin || "https://linkedin.com/in/aarav-sharma-cs");
  const [bio, setBio] = useState(student.bio || "");
  const [resumeFile, setResumeFile] = useState(student.resumeName || "Aarav_Sharma_Resume_2026.pdf");

  // Selected role & department helpers
  const selectedRoleObj = careerRoles.find((r) => r.id === targetRoleId) || careerRoles[0];
  const selectedDeptObj = departments.find((d) => d.id === departmentId) || departments[0];
  const isCrossDisciplinary = !selectedRoleObj.recommendedDepts.includes(departmentId);

  const handleAddSkill = (e) => {
    // Works from both button click and Enter key press
    if (e && e.preventDefault) e.preventDefault();
    const trimmed = newSkillInput.trim();
    if (!trimmed) return;
    if (skills.includes(trimmed)) {
      showToast("Skill already added!", "error");
      return;
    }
    setSkills((prev) => [...prev, trimmed]);
    setNewSkillInput("");
    setErrorMsg("");
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // prevent wizard form from submitting
      handleAddSkill(e);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSimulateResumeUpload = () => {
    setResumeFile("Engineering_Resume_Updated_2026.pdf");
    showToast("Resume parsed! Core competencies verified.");
  };

  const handleNextStep1 = () => {
    if (!name.trim() || !college.trim() || !degree.trim()) {
      setErrorMsg("Please provide your full name, college, and degree program.");
      return;
    }
    setErrorMsg("");
    setStep(2);
  };

  const handleNextStep2 = () => {
    setErrorMsg("");
    setStep(3);
  };

  const handleCompleteSetup = () => {
    const profilePayload = {
      name,
      college,
      degree,
      departmentId,
      department: selectedDeptObj.name,
      currentYear,
      graduationYear,
      cgpa,
      targetRoleId,
      targetRole: selectedRoleObj.title,
      difficultyLevel,
      targetTier,
      skills,
      github,
      linkedin,
      bio,
      resumeName: resumeFile,
      profileCompletion: 100,
      isTemporaryData: true
    };

    const validation = validateStudentProfile(profilePayload);
    if (!validation.isValid) {
      setErrorMsg(validation.errors.join(" "));
      return;
    }

    updateStudentProfile(profilePayload);
    showToast("Profile personalization complete! Redirecting to Dashboard...");
    navigate("/dashboard");
  };

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto", padding: "1rem 0 3rem" }}>
      {/* Wizard Header */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{ display: "inline-flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <Badge variant="indigo">Step {step} of 3 • Phase 2 Personalization</Badge>
          <span className="demo-badge-pill">Temporary Client Storage</span>
        </div>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--navy-900)", letterSpacing: "-0.025em" }}>
          Student Profile & Career Personalization
        </h1>
        <p style={{ color: "var(--navy-500)", fontSize: "0.9375rem" }}>
          Configure your academic standing, target career role, skills, and preparation difficulty level.
        </p>

        {/* Step Indicator Progress Bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginTop: "1.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: step >= 1 ? "var(--indigo-600)" : "var(--navy-200)",
                color: "#ffffff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.8125rem",
                fontWeight: 700
              }}
            >
              1
            </span>
            <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: step >= 1 ? "var(--indigo-700)" : "var(--navy-400)" }}>
              Academics & Department
            </span>
          </div>

          <div style={{ width: "40px", height: "2px", background: step >= 2 ? "var(--indigo-600)" : "var(--navy-200)" }} />

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: step >= 2 ? "var(--indigo-600)" : "var(--navy-200)",
                color: "#ffffff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.8125rem",
                fontWeight: 700
              }}
            >
              2
            </span>
            <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: step >= 2 ? "var(--indigo-700)" : "var(--navy-400)" }}>
              Career Role & Difficulty
            </span>
          </div>

          <div style={{ width: "40px", height: "2px", background: step >= 3 ? "var(--indigo-600)" : "var(--navy-200)" }} />

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: step >= 3 ? "var(--indigo-600)" : "var(--navy-200)",
                color: "#ffffff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.8125rem",
                fontWeight: 700
              }}
            >
              3
            </span>
            <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: step >= 3 ? "var(--indigo-700)" : "var(--navy-400)" }}>
              Skills & Resume
            </span>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div
          style={{
            background: "var(--rose-50)",
            border: "1px solid var(--rose-200, #fecdd3)",
            color: "var(--rose-600)",
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            fontSize: "0.8125rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1.25rem"
          }}
        >
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span>{errorMsg}</span>
        </div>
      )}

      <Card style={{ padding: "2.25rem" }}>
        {/* STEP 1: Academic & Department Information */}
        {step === 1 && (
          <div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.35rem" }}>
              1. Student Academic Profile
            </h3>
            <p style={{ fontSize: "0.875rem", color: "var(--navy-500)", marginBottom: "1.75rem" }}>
              Specify your university degree, engineering department, and current academic year.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label form-label-required">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Aarav Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label form-label-required">College / Institute Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. National Institute of Technology, Trichy"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label form-label-required">Degree Program</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. B.Tech in Computer Science & Engineering"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label form-label-required">Academic Department</label>
                <select
                  className="form-select"
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                >
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                <span className="form-hint">Selected: {selectedDeptObj.name}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="form-group">
                <label className="form-label form-label-required">Current Year of Study</label>
                <select
                  className="form-select"
                  value={currentYear}
                  onChange={(e) => setCurrentYear(e.target.value)}
                >
                  <option value="1st Year">1st Year (Foundation)</option>
                  <option value="2nd Year">2nd Year (Core Pre-Placement)</option>
                  <option value="3rd Year">3rd Year (Internship Ready)</option>
                  <option value="4th Year (Final Year)">4th Year (Final Placement Year)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label form-label-required">Graduation Year</label>
                <select
                  className="form-select"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                >
                  <option value="2025">Class of 2025</option>
                  <option value="2026">Class of 2026</option>
                  <option value="2027">Class of 2027</option>
                  <option value="2028">Class of 2028</option>
                  <option value="2029">Class of 2029</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Cumulative CGPA (out of 10.0)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 8.85"
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3" style={{ marginTop: "2rem" }}>
              <Button variant="primary" onClick={handleNextStep1}>
                <span>Next: Target Career Role</span>
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: Career Role & Difficulty Level */}
        {step === 2 && (
          <div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.35rem" }}>
              2. Target Career Role & Difficulty Selection
            </h3>
            <p style={{ fontSize: "0.875rem", color: "var(--navy-500)", marginBottom: "1.75rem" }}>
              Select any of the 20+ engineering career paths. Cross-disciplinary transitions are fully supported!
            </p>

            <div className="grid grid-cols-2 gap-4" style={{ marginBottom: "1.5rem" }}>
              <div className="form-group">
                <label className="form-label form-label-required">Target Career Role</label>
                <select
                  className="form-select"
                  value={targetRoleId}
                  onChange={(e) => setTargetRoleId(e.target.value)}
                >
                  {careerRoles.map((role) => {
                    const isDirect = role.recommendedDepts.includes(departmentId);
                    return (
                      <option key={role.id} value={role.id}>
                        {role.title} {isDirect ? "★ (Direct Fit)" : "⇄ (Cross-Disciplinary)"}
                      </option>
                    );
                  })}
                </select>
                <span className="form-hint">
                  {selectedRoleObj.category} • CTC: {selectedRoleObj.avgPackage}
                </span>
              </div>

              <div className="form-group">
                <label className="form-label form-label-required">Preferred Preparation Difficulty</label>
                <select
                  className="form-select"
                  value={difficultyLevel}
                  onChange={(e) => setDifficultyLevel(e.target.value)}
                >
                  <option value="Beginner">Beginner (Foundations & Standard On-Campus Drives)</option>
                  <option value="Intermediate">Intermediate (Tier-2 High-Growth Tech Firms)</option>
                  <option value="Advanced">Advanced (Top Tier-1 Product Companies)</option>
                  <option value="Tier-1 Elite">Tier-1 Elite (FAANG & High Frequency Trading)</option>
                </select>
                <span className="form-hint">Calibrates AI mock interview depth and question bank filters.</span>
              </div>
            </div>

            {/* Cross-Disciplinary Pathway Card */}
            <div
              style={{
                background: isCrossDisciplinary ? "var(--amber-50)" : "var(--emerald-50)",
                border: isCrossDisciplinary ? "1px solid var(--amber-200)" : "1px solid var(--emerald-200)",
                borderRadius: "10px",
                padding: "1rem 1.25rem",
                marginBottom: "1.5rem"
              }}
            >
              <div className="flex items-center gap-2" style={{ marginBottom: "0.25rem" }}>
                {isCrossDisciplinary ? (
                  <>
                    <Shuffle size={16} color="var(--amber-700)" />
                    <strong style={{ fontSize: "0.875rem", color: "var(--amber-900)" }}>
                      Cross-Disciplinary Transition Pathway Active
                    </strong>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} color="var(--emerald-700)" />
                    <strong style={{ fontSize: "0.875rem", color: "var(--emerald-900)" }}>
                      Direct Branch Alignment
                    </strong>
                  </>
                )}
              </div>
              <p style={{ fontSize: "0.8125rem", color: isCrossDisciplinary ? "var(--amber-800)" : "var(--emerald-800)", margin: 0, lineHeight: 1.5 }}>
                {isCrossDisciplinary
                  ? `You are in ${selectedDeptObj.name} targeting ${selectedRoleObj.title}. Our AI adds foundational bridge topics into your roadmap so you master the prerequisite fundamentals effortlessly.`
                  : `${selectedRoleObj.title} is naturally aligned with ${selectedDeptObj.name}. Core coursework maps directly to placement interview rounds.`}
              </p>
            </div>

            <div className="flex justify-between items-center" style={{ marginTop: "2rem" }}>
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft size={16} />
                <span>Back</span>
              </Button>
              <Button variant="primary" onClick={handleNextStep2}>
                <span>Next: Existing Skills & Resume</span>
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Existing Skills & Resume */}
        {step === 3 && (
          <div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.35rem" }}>
              3. Existing Skills & Technical Resume
            </h3>
            <p style={{ fontSize: "0.875rem", color: "var(--navy-500)", marginBottom: "1.75rem" }}>
              Add the programming languages, tools, and frameworks you currently know.
            </p>

            {/* Skills Tag Editor */}
            <div className="form-group">
              <label className="form-label form-label-required">Existing Technical Skills</label>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Python, React, SQL, AutoCAD, C++..."
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                />
                <Button size="sm" variant="secondary" type="button" onClick={handleAddSkill}>
                  <Plus size={16} />
                  <span>Add Skill</span>
                </Button>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
                {skills.map((skill) => (
                  <span
                    key={skill}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      background: "var(--navy-100)",
                      border: "1px solid var(--navy-300)",
                      padding: "0.25rem 0.65rem",
                      borderRadius: "999px",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      color: "var(--navy-800)"
                    }}
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      style={{ color: "var(--navy-500)", display: "flex", alignItems: "center" }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Resume Upload Simulation */}
            <div className="form-group">
              <label className="form-label">Engineering Placement Resume (PDF)</label>
              <div
                style={{
                  border: "2px dashed var(--border-color)",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  textAlign: "center",
                  background: "var(--navy-50)"
                }}
              >
                <div style={{ display: "inline-flex", padding: "0.6rem", borderRadius: "50%", background: "var(--indigo-50)", color: "var(--indigo-600)", marginBottom: "0.5rem" }}>
                  <UploadCloud size={20} />
                </div>
                <div style={{ fontWeight: 600, fontSize: "0.875rem", marginBottom: "0.25rem" }}>
                  {resumeFile || "Click to upload your resume (PDF)"}
                </div>
                <Button size="sm" variant="outline" type="button" onClick={handleSimulateResumeUpload}>
                  Simulate Upload
                </Button>
              </div>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">GitHub Repository Profile</label>
                <div className="search-box">
                  <Globe size={16} />
                  <input
                    type="url"
                    className="form-input"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">LinkedIn Profile</label>
                <div className="search-box">
                  <Link2 size={16} />
                  <input
                    type="url"
                    className="form-input"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center" style={{ marginTop: "2rem" }}>
              <Button variant="outline" onClick={() => setStep(2)}>
                <ArrowLeft size={16} />
                <span>Back</span>
              </Button>
              <Button variant="primary" onClick={handleCompleteSetup}>
                <CheckCircle2 size={16} />
                <span>Save Profile & Launch Personalized Dashboard</span>
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
