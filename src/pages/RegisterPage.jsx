import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  User,
  Mail,
  Lock,
  Building2,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { useApp } from "../context/AppContext";

export const RegisterPage = () => {
  const { register, showToast, departments } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    college: "",
    department: "Computer Science Engineering (CSE)",
    departmentId: "cse",
    graduationYear: "2026",
    password: "",
    confirmPassword: "",
    agreeTerms: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleQuickDemoRegister = () => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    setFormData({
      name: "Aarav Sharma",
      email: `aarav.student${randomSuffix}@nit.edu.in`,
      college: "National Institute of Technology",
      department: "Computer Science Engineering (CSE)",
      departmentId: "cse",
      graduationYear: "2026",
      password: "Password123",
      confirmPassword: "Password123",
      agreeTerms: true
    });
    setError("");
    showToast("Filled demo registration form with unique student email!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.college) {
      setError("Please complete all required fields.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (!/[A-Z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
      setError("Password must contain at least one uppercase letter and one number.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }

    if (!formData.agreeTerms) {
      setError("Please agree to the terms to continue.");
      return;
    }

    setLoading(true);
    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        college: formData.college.trim(),
        department: formData.department,
        department_id: formData.departmentId || "cse",
        graduation_year: parseInt(formData.graduationYear, 10)
      });
      showToast("Account created successfully! Configure your placement profile.");
      navigate("/profile-setup");
    } catch (err) {
      setError(err.message || "Registration failed. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 72px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 1rem",
        background: "radial-gradient(ellipse at 50% 0%, #1e1b4b 0%, #0a0f1d 80%)"
      }}
    >
      <div style={{ maxWidth: "600px", width: "100%" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
            <div className="brand-icon" style={{ width: 42, height: 42 }}>
              <Sparkles size={22} />
            </div>
            <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#ffffff" }}>
              CareerCoach <span style={{ color: "var(--indigo-400)" }}>AI</span>
            </span>
          </Link>
          <h2 style={{ fontSize: "1.625rem", fontWeight: 700, color: "#ffffff" }}>
            Start Your Placement Preparation
          </h2>
          <p style={{ color: "var(--navy-400)", fontSize: "0.875rem", marginTop: "0.35rem" }}>
            Join 45,000+ engineering students preparing for Tier-1 & Tier-2 campus drives
          </p>
        </div>

        <Card style={{ padding: "2.25rem", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.4)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
          {/* Quick Demo Preload Banner */}
          <div
            style={{
              background: "var(--indigo-50)",
              border: "1px solid var(--indigo-200)",
              borderRadius: "8px",
              padding: "0.75rem 1rem",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <div>
              <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--indigo-900)" }}>
                Testing the onboarding flow?
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--indigo-700)" }}>
                Auto-fill complete student registration data
              </div>
            </div>
            <Button size="sm" variant="primary" type="button" onClick={handleQuickDemoRegister}>
              Auto-Fill Form
            </Button>
          </div>

          {error && (
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
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label form-label-required">Full Name</label>
                <div className="search-box">
                  <User size={16} />
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    placeholder="Aarav Sharma"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label form-label-required">College Email</label>
                <div className="search-box">
                  <Mail size={16} />
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    placeholder="student@nit.edu.in"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label form-label-required">Engineering College</label>
                <div className="search-box">
                  <Building2 size={16} />
                  <input
                    type="text"
                    name="college"
                    className="form-input"
                    placeholder="e.g. NIT Trichy / IIT / VIT"
                    value={formData.college}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label form-label-required">Graduation Year</label>
                <div className="search-box">
                  <GraduationCap size={16} />
                  <select
                    name="graduationYear"
                    className="form-select"
                    value={formData.graduationYear}
                    onChange={handleChange}
                  >
                    <option value="2025">Class of 2025 (Immediate)</option>
                    <option value="2026">Class of 2026 (Upcoming Drives)</option>
                    <option value="2027">Class of 2027 (Pre-final Year)</option>
                    <option value="2028">Class of 2028 (Foundation Year)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label form-label-required">Engineering Department</label>
              <select
                name="department"
                className="form-select"
                value={formData.department}
                onChange={handleChange}
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name} ({d.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label form-label-required">Password</label>
                <div className="search-box">
                  <Lock size={16} />
                  <input
                    type="password"
                    name="password"
                    className="form-input"
                    placeholder="Min 8 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label form-label-required">Confirm Password</label>
                <div className="search-box">
                  <Lock size={16} />
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-input"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label className="flex items-center gap-2" style={{ fontSize: "0.8125rem", color: "var(--navy-600)", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  style={{ accentColor: "var(--indigo-600)" }}
                />
                <span>I agree to CareerCoach AI placement preparation Terms & Privacy Policy</span>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              style={{ width: "100%" }}
            >
              <span>Create Account & Continue to Profile Setup</span>
              <ArrowRight size={18} />
            </Button>
          </form>

          <div
            style={{
              textAlign: "center",
              marginTop: "1.5rem",
              paddingTop: "1.25rem",
              borderTop: "1px solid var(--border-color)",
              fontSize: "0.875rem",
              color: "var(--navy-500)"
            }}
          >
            Already have an active account?{" "}
            <Link to="/login" style={{ color: "var(--indigo-600)", fontWeight: 700 }}>
              Sign In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
