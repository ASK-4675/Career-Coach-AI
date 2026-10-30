import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  HelpCircle
} from "lucide-react";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { Modal } from "../components/common/Modal";
import { useApp } from "../context/AppContext";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const { login, showToast } = useApp();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter both your college email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await login(email.trim(), password);
      showToast(`Signed in successfully as ${res.user?.name || "Student"}!`);
      navigate("/dashboard");
    } catch (err) {
      setErrorMessage(err.message || "Invalid email or password. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoFill = () => {
    setEmail("aarav.sharma@nit.edu.in");
    setPassword("Password123");
    setErrorMessage("");
    showToast("Demo student credentials loaded!");
  };

  const handleSimulateError = () => {
    setEmail("invalid.student@college.edu");
    setPassword("wrongpassword");
    setErrorMessage("Invalid credentials. Try the Quick Fill Demo button for instant access.");
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setForgotSubmitted(true);
    setTimeout(() => {
      setForgotModalOpen(false);
      setForgotSubmitted(false);
      showToast(`Password reset link sent to ${forgotEmail || "your email"}`);
    }, 1200);
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 72px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2.5rem 1rem",
        background: "radial-gradient(ellipse at 50% 0%, #1e1b4b 0%, #0a0f1d 80%)"
      }}
    >
      <div style={{ maxWidth: "460px", width: "100%" }}>
        {/* Logo and Intro */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
            <div className="brand-icon" style={{ width: 42, height: 42 }}>
              <Sparkles size={22} />
            </div>
            <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#ffffff" }}>
              CareerCoach <span style={{ color: "var(--indigo-400)" }}>AI</span>
            </span>
          </Link>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#ffffff" }}>
            Welcome back, Student
          </h2>
          <p style={{ color: "var(--navy-400)", fontSize: "0.875rem", marginTop: "0.35rem" }}>
            Sign in to continue your placement preparation track
          </p>
        </div>

        {/* Login Card */}
        <Card style={{ padding: "2rem", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.4)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
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
                Evaluating CareerCoach AI?
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--indigo-700)" }}>
                Preload sample engineering student credentials
              </div>
            </div>
            <Button size="sm" variant="primary" onClick={handleQuickDemoFill}>
              Quick Fill Demo
            </Button>
          </div>

          {errorMessage && (
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
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label form-label-required">College Email Address</label>
              <div className="search-box">
                <Mail size={16} />
                <input
                  type="email"
                  className="form-input"
                  placeholder="name@college.edu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="flex items-center justify-between" style={{ marginBottom: "0.375rem" }}>
                <label className="form-label form-label-required" style={{ margin: 0 }}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  style={{ fontSize: "0.75rem", color: "var(--indigo-600)", fontWeight: 600 }}
                >
                  Forgot password?
                </button>
              </div>

              <div style={{ position: "relative" }}>
                <div className="search-box">
                  <Lock size={16} />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--navy-400)"
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between" style={{ marginBottom: "1.5rem" }}>
              <label className="flex items-center gap-2" style={{ fontSize: "0.8125rem", color: "var(--navy-600)", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: "var(--indigo-600)" }}
                />
                <span>Remember this workstation</span>
              </label>

              <button
                type="button"
                onClick={handleSimulateError}
                style={{ fontSize: "0.75rem", color: "var(--navy-400)", textDecoration: "underline" }}
                title="Test how error states appear"
              >
                Test Error State
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              style={{ width: "100%" }}
            >
              <span>Sign In to Dashboard</span>
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
            Don't have an engineering student profile?{" "}
            <Link to="/register" style={{ color: "var(--indigo-600)", fontWeight: 700 }}>
              Create Account
            </Link>
          </div>
        </Card>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Reset Student Password"
      >
        <form onSubmit={handleForgotSubmit}>
          <p style={{ fontSize: "0.875rem", color: "var(--navy-600)", marginBottom: "1rem" }}>
            Enter your registered college email. We will send a secure verification code to reset your account password.
          </p>
          <div className="form-group">
            <label className="form-label form-label-required">College Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="aarav.sharma@nit.edu.in"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-2" style={{ marginTop: "1.5rem" }}>
            <Button type="button" variant="outline" size="sm" onClick={() => setForgotModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={forgotSubmitted}>
              Send Reset Link
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
