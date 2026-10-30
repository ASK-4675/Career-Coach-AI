import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Settings,
  User,
  Mail,
  Building,
  GraduationCap,
  Save,
  RotateCcw,
  Shield,
  Bell,
  Sparkles,
  FileText,
  Briefcase,
  Layers,
  Shuffle,
  Plus,
  Trash2,
  AlertCircle
} from "lucide-react";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { Modal } from "../components/common/Modal";
import { useApp } from "../context/AppContext";

export const ProfileSettingsPage = () => {
  const {
    student,
    updateStudentProfile,
    departments,
    careerRoles,
    currentRole,
    currentDepartment,
    crossDisciplinaryInfo,
    validateStudentProfile,
    showToast
  } = useApp();

  const [formData, setFormData] = useState({
    name: student.name || "",
    email: student.email || "",
    college: student.college || "",
    degree: student.degree || "B.Tech in Computer Science & Engineering",
    departmentId: student.departmentId || "cse",
    department: student.department || "Computer Science Engineering (CSE)",
    currentYear: student.currentYear || "4th Year (Final Year)",
    graduationYear: student.graduationYear || "2026",
    cgpa: student.cgpa || "",
    targetRoleId: student.targetRoleId || "full-stack-developer",
    targetRole: student.targetRole || "Full-Stack Developer",
    difficultyLevel: student.difficultyLevel || "Intermediate",
    github: student.github || "",
    linkedin: student.linkedin || "",
    bio: student.bio || ""
  });

  const [skills, setSkills] = useState(student.skills || ["JavaScript", "React", "Node.js", "Java", "SQL"]);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [notificationsEnabled, setNotificationsEnabled] = useState({
    mockReminders: true,
    dailyChallenge: true,
    weeklyReport: true
  });

  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "departmentId") {
      const dept = departments.find((d) => d.id === value);
      setFormData((prev) => ({
        ...prev,
        departmentId: value,
        department: dept ? dept.name : value
      }));
    } else if (name === "targetRoleId") {
      const role = careerRoles.find((r) => r.id === value);
      setFormData((prev) => ({
        ...prev,
        targetRoleId: value,
        targetRole: role ? role.title : value
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddSkill = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const trimmed = newSkillInput.trim();
    if (!trimmed) return;
    if (skills.includes(trimmed)) {
      showToast("Skill already added!", "error");
      return;
    }
    setSkills((prev) => [...prev, trimmed]);
    setNewSkillInput("");
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill(e);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setErrorMsg("");

    const payload = {
      ...formData,
      skills
    };

    const validation = validateStudentProfile(payload);
    if (!validation.isValid) {
      setErrorMsg(validation.errors.join(" "));
      return;
    }

    updateStudentProfile(payload);
  };

  const handleResetDemoData = () => {
    localStorage.clear();
    setResetModalOpen(false);
    showToast("Demo data re-initialized to standard state! Reloading...");
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) {
      showToast("New passwords do not match.", "error");
      return;
    }
    setPasswordModalOpen(false);
    setPasswords({ current: "", newPass: "", confirm: "" });
    showToast("Password updated successfully!");
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1>
            <Settings size={28} color="var(--indigo-600)" />
            <span>Student Profile & Account Settings</span>
          </h1>
          <p>
            Update your academic degree, engineering branch, target career role, and skills.
          </p>
        </div>

        <div className="page-actions">
          <Button variant="danger" size="sm" onClick={() => setResetModalOpen(true)}>
            <RotateCcw size={14} />
            <span>Reset Demo Data</span>
          </Button>
        </div>
      </div>

      {/* Temporary Client-side storage banner */}
      <div
        style={{
          background: "var(--navy-50)",
          border: "1px solid var(--border-color)",
          borderRadius: "10px",
          padding: "0.75rem 1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.75rem",
          flexWrap: "wrap",
          gap: "0.5rem"
        }}
      >
        <div className="flex items-center gap-2">
          <span className="demo-badge-pill">Temporary Client-Side Storage</span>
          <span style={{ fontSize: "0.8125rem", color: "var(--navy-600)" }}>
            Profile configurations persist locally in your browser sandbox (`localStorage`).
          </span>
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

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem" }}>
        {/* Left Column: Student Identity Card & Pathway Badge */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <Card style={{ textAlign: "center", padding: "2rem" }}>
            <div
              className="user-avatar"
              style={{
                width: "80px",
                height: "80px",
                fontSize: "1.75rem",
                margin: "0 auto 1rem",
                boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.4)"
              }}
            >
              {student.avatar}
            </div>

            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--navy-900)", marginBottom: "0.25rem" }}>
              {student.name}
            </h3>
            <p style={{ fontSize: "0.8125rem", color: "var(--navy-500)", marginBottom: "0.75rem" }}>
              {student.email}
            </p>

            <div className="flex justify-center gap-2" style={{ marginBottom: "1rem" }}>
              <Badge variant="indigo">{formData.targetRole}</Badge>
              {crossDisciplinaryInfo.isCross ? (
                <Badge variant="amber" icon={Shuffle}>Cross-Branch</Badge>
              ) : (
                <Badge variant="emerald">Direct Fit</Badge>
              )}
            </div>

            <div style={{ background: "var(--navy-50)", padding: "1rem", borderRadius: "10px", textAlign: "left", fontSize: "0.8125rem", border: "1px solid var(--border-color)" }}>
              <div style={{ marginBottom: "0.5rem" }}>
                <span style={{ color: "var(--navy-400)" }}>Department: </span>
                <strong style={{ color: "var(--navy-800)" }}>{formData.department}</strong>
              </div>
              <div style={{ marginBottom: "0.5rem" }}>
                <span style={{ color: "var(--navy-400)" }}>College: </span>
                <strong style={{ color: "var(--navy-800)" }}>{formData.college}</strong>
              </div>
              <div style={{ marginBottom: "0.5rem" }}>
                <span style={{ color: "var(--navy-400)" }}>Year of Study: </span>
                <strong style={{ color: "var(--navy-800)" }}>{formData.currentYear}</strong>
              </div>
              <div style={{ marginBottom: "0.5rem" }}>
                <span style={{ color: "var(--navy-400)" }}>Graduation: </span>
                <strong style={{ color: "var(--navy-800)" }}>Class of {formData.graduationYear}</strong>
              </div>
              <div>
                <span style={{ color: "var(--navy-400)" }}>Difficulty Track: </span>
                <strong style={{ color: "var(--indigo-700)" }}>{formData.difficultyLevel}</strong>
              </div>
            </div>

            <div style={{ marginTop: "1.25rem" }}>
              <Button
                variant="outline"
                size="sm"
                style={{ width: "100%" }}
                onClick={() => setPasswordModalOpen(true)}
              >
                <Shield size={14} />
                <span>Change Password</span>
              </Button>
            </div>
          </Card>

          {/* Placement Notification Toggles */}
          <Card title="Placement Notifications">
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "0.5rem" }}>
              <label className="flex items-center justify-between" style={{ cursor: "pointer", fontSize: "0.875rem" }}>
                <span>Mock interview reminder alarms</span>
                <input
                  type="checkbox"
                  checked={notificationsEnabled.mockReminders}
                  onChange={(e) => setNotificationsEnabled({ ...notificationsEnabled, mockReminders: e.target.checked })}
                  style={{ accentColor: "var(--indigo-600)" }}
                />
              </label>

              <label className="flex items-center justify-between" style={{ cursor: "pointer", fontSize: "0.875rem" }}>
                <span>Daily role challenge notifications</span>
                <input
                  type="checkbox"
                  checked={notificationsEnabled.dailyChallenge}
                  onChange={(e) => setNotificationsEnabled({ ...notificationsEnabled, dailyChallenge: e.target.checked })}
                  style={{ accentColor: "var(--indigo-600)" }}
                />
              </label>
            </div>
          </Card>
        </div>

        {/* Right Column: Edit All 8 Required Profile Fields Form */}
        <Card title="Edit Academic & Career Personalization" subtitle="Update your profile parameters to calibrate mock rounds">
          <form onSubmit={handleSaveProfile} style={{ marginTop: "1rem" }}>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label form-label-required">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label form-label-required">College Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label form-label-required">College / University</label>
                <input
                  type="text"
                  name="college"
                  className="form-input"
                  value={formData.college}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label form-label-required">Degree Program</label>
                <input
                  type="text"
                  name="degree"
                  className="form-input"
                  value={formData.degree}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label form-label-required">Academic Department</label>
                <select
                  name="departmentId"
                  className="form-select"
                  value={formData.departmentId}
                  onChange={handleChange}
                >
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label form-label-required">Current Year of Study</label>
                <select
                  name="currentYear"
                  className="form-select"
                  value={formData.currentYear}
                  onChange={handleChange}
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year (Final Year)">4th Year (Final Year)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label form-label-required">Graduation Year</label>
                <select
                  name="graduationYear"
                  className="form-select"
                  value={formData.graduationYear}
                  onChange={handleChange}
                >
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                  <option value="2029">2029</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label form-label-required">Preferred Preparation Difficulty</label>
                <select
                  name="difficultyLevel"
                  className="form-select"
                  value={formData.difficultyLevel}
                  onChange={handleChange}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Tier-1 Elite">Tier-1 Elite</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label form-label-required">Target Career Role (20+ Catalog)</label>
              <select
                name="targetRoleId"
                className="form-select"
                value={formData.targetRoleId}
                onChange={handleChange}
              >
                {careerRoles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.title} ({role.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Existing Skills Editor */}
            <div className="form-group">
              <label className="form-label form-label-required">Existing Skills & Technologies</label>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Add skill (e.g. Docker, Python, SolidWorks)..."
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                />
                <Button size="sm" variant="secondary" type="button" onClick={handleAddSkill}>
                  <Plus size={16} />
                  <span>Add</span>
                </Button>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
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

            <div className="form-group">
              <label className="form-label">Personal Bio / Career Statement</label>
              <textarea
                name="bio"
                className="form-textarea"
                rows={3}
                value={formData.bio}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end gap-3" style={{ marginTop: "1.5rem" }}>
              <Button type="submit" variant="primary">
                <Save size={16} />
                <span>Save Profile Changes</span>
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title="Reset Demo Data"
      >
        <p style={{ fontSize: "0.875rem", color: "var(--navy-600)", lineHeight: 1.6 }}>
          This will wipe custom changes stored in your browser's local storage and re-initialize the standard demo profile, roadmap progress, and questions.
        </p>
        <div className="flex justify-end gap-2" style={{ marginTop: "1.5rem" }}>
          <Button variant="outline" size="sm" onClick={() => setResetModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleResetDemoData}>
            Confirm Reset
          </Button>
        </div>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        title="Update Student Password"
      >
        <form onSubmit={handleChangePasswordSubmit}>
          <div className="form-group">
            <label className="form-label form-label-required">Current Password</label>
            <input
              type="password"
              className="form-input"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label form-label-required">New Password</label>
            <input
              type="password"
              className="form-input"
              value={passwords.newPass}
              onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label form-label-required">Confirm New Password</label>
            <input
              type="password"
              className="form-input"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              required
            />
          </div>
          <div className="flex justify-end gap-2" style={{ marginTop: "1.5rem" }}>
            <Button type="button" variant="outline" size="sm" onClick={() => setPasswordModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Update Password
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
