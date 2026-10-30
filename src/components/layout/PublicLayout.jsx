import React from "react";
import { Outlet, Link } from "react-router-dom";
import { Navbar } from "../common/Navbar";
import { Toast } from "../common/Toast";
import { Sparkles, Heart } from "lucide-react";

export const PublicLayout = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <footer className="public-footer">
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "2.5rem",
              marginBottom: "3rem"
            }}
          >
            <div>
              <div className="brand-logo" style={{ marginBottom: "1rem" }}>
                <div className="brand-icon">
                  <Sparkles size={18} />
                </div>
                <span>CareerCoach</span>
                <span className="brand-badge">AI</span>
              </div>
              <p style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "var(--navy-400)" }}>
                Empowering engineering students across India and worldwide with intelligent, tailored placement preparation, realistic mock rounds, and structured roadmaps.
              </p>
            </div>

            <div>
              <div style={{ color: "#ffffff", fontWeight: 700, fontSize: "0.875rem", marginBottom: "1rem" }}>
                AI Features
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.875rem" }}>
                <Link to="/interview-coach" style={{ color: "var(--navy-400)" }}>AI Technical Interviewer</Link>
                <Link to="/communication-coach" style={{ color: "var(--navy-400)" }}>Communication Skills Coach</Link>
                <Link to="/skill-gap" style={{ color: "var(--navy-400)" }}>Role Benchmark & Gap Analysis</Link>
                <Link to="/question-bank" style={{ color: "var(--navy-400)" }}>Curated Question Bank</Link>
              </div>
            </div>

            <div>
              <div style={{ color: "#ffffff", fontWeight: 700, fontSize: "0.875rem", marginBottom: "1rem" }}>
                Placement Tracks
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.875rem" }}>
                <Link to="/departments" style={{ color: "var(--navy-400)" }}>Engineering Departments</Link>
                <Link to="/career-roles" style={{ color: "var(--navy-400)" }}>Target Role Profiles</Link>
                <Link to="/roadmap" style={{ color: "var(--navy-400)" }}>8-Week Placement Roadmap</Link>
                <Link to="/weekly-report" style={{ color: "var(--navy-400)" }}>Weekly Progress Analytics</Link>
              </div>
            </div>

            <div>
              <div style={{ color: "#ffffff", fontWeight: 700, fontSize: "0.875rem", marginBottom: "1rem" }}>
                Student Access
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.875rem" }}>
                <Link to="/dashboard" style={{ color: "var(--navy-400)" }}>Student Main Dashboard</Link>
                <Link to="/login" style={{ color: "var(--navy-400)" }}>Student Portal Login</Link>
                <Link to="/register" style={{ color: "var(--navy-400)" }}>Register Free Account</Link>
                <Link to="/settings" style={{ color: "var(--navy-400)" }}>Profile & Account Settings</Link>
              </div>
            </div>
          </div>

          <div
            style={{
              paddingTop: "2rem",
              borderTop: "1px solid var(--navy-800)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
              fontSize: "0.8125rem",
              color: "var(--navy-500)"
            }}
          >
            <div>© 2026 CareerCoach AI. Phase 1 Frontend Foundation. Designed for Engineering Placements.</div>
            <div className="flex items-center gap-1">
              <span>Engineered with modern React & CSS</span>
            </div>
          </div>
        </div>
      </footer>
      <Toast />
    </div>
  );
};
