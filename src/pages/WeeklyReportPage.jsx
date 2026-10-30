import React from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Calendar,
  Download,
  CheckCircle2,
  TrendingUp,
  Award,
  Bot,
  Clock,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { useApp } from "../context/AppContext";

export const WeeklyReportPage = () => {
  const { student, currentRole, weeklyReport, showToast } = useApp();

  const handleExportPDF = () => {
    showToast("Generating Weekly Progress Analytics Report PDF... (Demo Export)");
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1>
            <BarChart3 size={28} color="var(--indigo-600)" />
            <span>Weekly Placement Velocity Report</span>
          </h1>
          <p>
            Summary of hours invested, problem-solving accuracy, spoken communication progression, and AI coach remarks.
          </p>
        </div>

        <div className="page-actions">
          <Button variant="outline" onClick={handleExportPDF}>
            <Download size={16} />
            <span>Export Report (PDF)</span>
          </Button>
          <Link to="/dashboard">
            <Button variant="primary">
              <span>Back to Dashboard</span>
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </div>

      {/* Report Header Banner */}
      <Card style={{ padding: "1.75rem", marginBottom: "2rem", background: "linear-gradient(90deg, #1e1b4b 0%, #0f172a 100%)", color: "#ffffff" }}>
        <div className="flex items-center justify-between" style={{ flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div className="flex items-center gap-2" style={{ marginBottom: "0.25rem" }}>
              <Badge variant="indigo">Official Placement Telemetry</Badge>
              <span style={{ fontSize: "0.8125rem", color: "#a5b4fc" }}>
                Period: {weeklyReport.weekPeriod}
              </span>
            </div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#ffffff" }}>
              {student.name} • {currentRole.title} Track
            </h2>
            <p style={{ fontSize: "0.875rem", color: "#cbd5e1", margin: 0 }}>
              {student.college} • Batch of {student.graduationYear}
            </p>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.75rem", color: "#a5b4fc", textTransform: "uppercase" }}>Overall Velocity</div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#10b981" }}>
              High Trajectory
            </div>
          </div>
        </div>
      </Card>

      {/* 4 Performance Metric Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2rem"
        }}
      >
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Hours Invested</span>
            <div className="stat-icon-wrapper" style={{ background: "var(--indigo-50)", color: "var(--indigo-600)" }}>
              <Clock size={20} />
            </div>
          </div>
          <div className="stat-value">{weeklyReport.hoursLogged} hrs</div>
          <div className="stat-trend stat-trend-up">
            <span>Target: {weeklyReport.hoursTarget} hrs</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Mock Interviews Taken</span>
            <div className="stat-icon-wrapper" style={{ background: "var(--purple-50)", color: "var(--purple-600)" }}>
              <Bot size={20} />
            </div>
          </div>
          <div className="stat-value">{weeklyReport.mockInterviewsCompleted} Rounds</div>
          <div className="stat-trend stat-trend-up">
            <span>100% completion rate</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Technical Code Accuracy</span>
            <div className="stat-icon-wrapper" style={{ background: "var(--emerald-50)", color: "var(--emerald-600)" }}>
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="stat-value">{weeklyReport.technicalAccuracy}</div>
          <div className="stat-trend stat-trend-up">
            <span>Top 5% bracket</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Speech & STAR Clarity</span>
            <div className="stat-icon-wrapper" style={{ background: "var(--cyan-50)", color: "var(--cyan-600)" }}>
              <Sparkles size={20} />
            </div>
          </div>
          <div className="stat-value">{weeklyReport.communicationAccuracy}</div>
          <div className="stat-trend stat-trend-up">
            <span>+12% vs last cycle</span>
          </div>
        </div>
      </div>

      {/* AI Coach Remarks & Core Highlights */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "1.75rem", marginBottom: "2rem" }}>
        {/* Remarks */}
        <Card title="AI Senior Placement Mentor Remarks" subtitle="Personalized synthesis of weekly mocks and code commits">
          <div style={{ background: "var(--navy-50)", padding: "1.25rem", borderRadius: "10px", marginTop: "0.5rem", border: "1px solid var(--border-color)" }}>
            <div className="flex items-center gap-2" style={{ marginBottom: "0.75rem" }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "var(--indigo-600)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Bot size={16} />
              </div>
              <span style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--navy-900)" }}>
                AI Head Coach Assessment
              </span>
            </div>
            <p style={{ fontSize: "0.875rem", color: "var(--navy-700)", lineHeight: 1.6, margin: 0 }}>
              "{weeklyReport.coachRemarks}"
            </p>
          </div>
        </Card>

        {/* Highlights */}
        <Card title="Weekly Key Highlights" subtitle="Competency milestones reached">
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", marginTop: "0.5rem" }}>
            {weeklyReport.highlights.map((h, i) => (
              <div
                key={i}
                style={{
                  padding: "0.875rem",
                  borderRadius: "8px",
                  border: "1px solid var(--border-color)",
                  background: "#ffffff"
                }}
              >
                <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--indigo-700)", marginBottom: "0.2rem" }}>
                  {h.title}
                </div>
                <div style={{ fontSize: "0.8125rem", color: "var(--navy-600)" }}>
                  {h.desc}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Day-by-Day Breakdown Table */}
      <Card title="Day-by-Day Placement Practice Breakdown" subtitle="Problems solved by domain across the past 7 days">
        <div style={{ overflowX: "auto", marginTop: "0.75rem" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--border-color)", color: "var(--navy-500)" }}>
                <th style={{ padding: "0.75rem 1rem", fontWeight: 700 }}>Day</th>
                <th style={{ padding: "0.75rem 1rem", fontWeight: 700 }}>DSA & Coding</th>
                <th style={{ padding: "0.75rem 1rem", fontWeight: 700 }}>System Design</th>
                <th style={{ padding: "0.75rem 1rem", fontWeight: 700 }}>Soft Skills / HR</th>
                <th style={{ padding: "0.75rem 1rem", fontWeight: 700 }}>Daily Status</th>
              </tr>
            </thead>
            <tbody>
              {weeklyReport.dayBreakdown.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td style={{ padding: "0.75rem 1rem", fontWeight: 600, color: "var(--navy-900)" }}>
                    {row.day}
                  </td>
                  <td style={{ padding: "0.75rem 1rem", color: "var(--navy-700)" }}>
                    {row.dsa} Problems
                  </td>
                  <td style={{ padding: "0.75rem 1rem", color: "var(--navy-700)" }}>
                    {row.systemDesign} Modules
                  </td>
                  <td style={{ padding: "0.75rem 1rem", color: "var(--navy-700)" }}>
                    {row.softSkills} Drills
                  </td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <Badge variant="emerald">
                      <CheckCircle2 size={12} />
                      Completed
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
