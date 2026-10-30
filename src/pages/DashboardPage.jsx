import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Bot,
  Mic,
  Code2,
  CheckCircle2,
  Flame,
  ArrowUpRight,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Award,
  BookOpen,
  Shuffle,
  Briefcase,
  Layers,
  GraduationCap
} from "lucide-react";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { Modal } from "../components/common/Modal";
import { useApp } from "../context/AppContext";

export const DashboardPage = () => {
  const {
    student,
    currentRole,
    currentDepartment,
    careerRoles,
    selectRole,
    crossDisciplinaryInfo,
    dashboardOverview,
    mockInterviews,
    showToast
  } = useApp();

  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const stats = dashboardOverview.stats;
  const weeklyData = dashboardOverview.weeklyActivity;
  const upcoming = dashboardOverview.upcomingInterviews;
  const dailyChallenge = dashboardOverview.dailyChallenge;

  const handleOpenFeedback = (item) => {
    setSelectedFeedback(item);
    setFeedbackModalOpen(true);
  };

  const handleQuickRoleChange = (e) => {
    selectRole(e.target.value);
  };

  return (
    <div>
      {/* Welcome Banner with Dynamic Personalization */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%)",
          borderRadius: "16px",
          padding: "2rem",
          color: "#ffffff",
          marginBottom: "2rem",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.2)"
        }}
      >
        <div style={{ position: "relative", zIndex: 10 }}>
          <div className="flex items-center gap-2" style={{ marginBottom: "0.75rem", flexWrap: "wrap" }}>
            <span className="demo-badge-pill" style={{ background: "rgba(245, 158, 11, 0.2)", borderColor: "rgba(245, 158, 11, 0.4)", color: "#fef3c7" }}>
              Phase 2 Active Personalization
            </span>
            <Badge variant="indigo">{student.department || currentDepartment.name}</Badge>
            {crossDisciplinaryInfo.isCross ? (
              <Badge variant="amber" icon={Shuffle}>Cross-Disciplinary Track Active</Badge>
            ) : (
              <Badge variant="emerald" icon={CheckCircle2}>Direct Branch Alignment</Badge>
            )}
          </div>

          <div className="flex items-start justify-between flex-wrap gap-4" style={{ marginBottom: "1rem" }}>
            <div>
              <h1 style={{ fontSize: "1.875rem", fontWeight: 800, letterSpacing: "-0.02em", color: "#ffffff", marginBottom: "0.25rem" }}>
                Welcome back, {student.name}!
              </h1>
              <p style={{ color: "#c7d2fe", fontSize: "0.9375rem", maxWidth: "680px", lineHeight: 1.5, margin: 0 }}>
                {student.degree} • Batch of {student.graduationYear} ({student.currentYear})
              </p>
              <p style={{ color: "#a5b4fc", fontSize: "0.8125rem", marginTop: "0.35rem" }}>
                {crossDisciplinaryInfo.pathwayNotes}
              </p>
            </div>

            {/* Live Target Role Selector Widget */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(8px)",
                padding: "0.75rem 1rem",
                borderRadius: "10px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                minWidth: "260px"
              }}
            >
              <div style={{ fontSize: "0.75rem", color: "#c7d2fe", fontWeight: 700, marginBottom: "0.35rem" }}>
                SWITCH TARGET CAREER ROLE
              </div>
              <select
                className="form-select"
                value={currentRole.id}
                onChange={handleQuickRoleChange}
                style={{
                  background: "#0d1424",
                  color: "#ffffff",
                  borderColor: "rgba(255, 255, 255, 0.2)",
                  fontSize: "0.875rem",
                  fontWeight: 600
                }}
              >
                {careerRoles.map((role) => (
                  <option key={role.id} value={role.id} style={{ background: "#0f172a", color: "#ffffff" }}>
                    {role.title} ({role.category})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap" style={{ marginTop: "1.5rem" }}>
            <Link to="/interview-coach">
              <Button variant="primary" size="md">
                <Bot size={16} />
                <span>Launch {currentRole.title} Mock Round</span>
              </Button>
            </Link>
            <Link to="/career-roles">
              <Button variant="outline" size="md" style={{ color: "#ffffff", borderColor: "rgba(255,255,255,0.25)" }}>
                <Briefcase size={16} />
                <span>Browse Full 20+ Role Catalog</span>
              </Button>
            </Link>
            <Link to="/roadmap">
              <Button variant="ghost" size="md" style={{ color: "#ffffff" }}>
                <span>View Roadmap</span>
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 5 Primary Metric Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2rem"
        }}
      >
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Completed Mock Interviews</span>
            <div className="stat-icon-wrapper" style={{ background: "var(--indigo-50)", color: "var(--indigo-600)" }}>
              <Bot size={20} />
            </div>
          </div>
          <div className="stat-value">{stats.interviewsCompleted.value}</div>
          <div className="stat-trend stat-trend-up">
            <ArrowUpRight size={14} />
            <span>{stats.interviewsCompleted.change}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Communication Score</span>
            <div className="stat-icon-wrapper" style={{ background: "var(--cyan-50)", color: "var(--cyan-600)" }}>
              <Mic size={20} />
            </div>
          </div>
          <div className="stat-value">{stats.communicationScore.value}</div>
          <div className="stat-trend stat-trend-up">
            <ArrowUpRight size={14} />
            <span>{stats.communicationScore.change}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Technical Score</span>
            <div className="stat-icon-wrapper" style={{ background: "var(--emerald-50)", color: "var(--emerald-600)" }}>
              <Code2 size={20} />
            </div>
          </div>
          <div className="stat-value">{stats.technicalScore.value}</div>
          <div className="stat-trend stat-trend-up">
            <ArrowUpRight size={14} />
            <span>{stats.technicalScore.change}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Roadmap Tasks Completed</span>
            <div className="stat-icon-wrapper" style={{ background: "var(--purple-50)", color: "var(--purple-600)" }}>
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="stat-value">{stats.tasksCompleted.value}</div>
          <div className="stat-trend stat-trend-neutral">
            <span>{stats.tasksCompleted.change}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Weekly Practice Streak</span>
            <div className="stat-icon-wrapper" style={{ background: "var(--amber-50)", color: "var(--amber-600)" }}>
              <Flame size={20} />
            </div>
          </div>
          <div className="stat-value">{stats.weeklyStreak.value}</div>
          <div className="stat-trend stat-trend-up">
            <span>{stats.weeklyStreak.change}</span>
          </div>
        </div>
      </div>

      {/* Dynamic Role Competencies & Preparation Categories Bar */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "1.75rem", marginBottom: "2rem" }}>
        {/* Core Competencies for Target Role */}
        <Card
          title={`Core Competencies for ${currentRole.title}`}
          subtitle="Key skills evaluated during campus interview drives"
          icon={Code2}
          action={
            <Link to="/career-roles">
              <Button variant="ghost" size="sm">
                <span>Change Track</span>
                <ArrowRight size={14} />
              </Button>
            </Link>
          }
        >
          <div style={{ marginTop: "0.75rem" }}>
            <p style={{ fontSize: "0.875rem", color: "var(--navy-600)", lineHeight: 1.5, marginBottom: "1rem" }}>
              {currentRole.description}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {currentRole.coreSkills.map((skill, idx) => (
                <span
                  key={idx}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    padding: "0.35rem 0.75rem",
                    borderRadius: "8px",
                    background: "var(--indigo-50)",
                    border: "1px solid var(--indigo-200)",
                    color: "var(--indigo-700)",
                    fontSize: "0.8125rem",
                    fontWeight: 600
                  }}
                >
                  <CheckCircle2 size={13} color="var(--indigo-600)" />
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </Card>

        {/* Personalized Preparation Categories */}
        <Card
          title="Curriculum Preparation Focus"
          subtitle={`Weighted syllabus for ${currentRole.title}`}
          icon={Layers}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.75rem" }}>
            {currentRole.preparationCategories.map((cat, idx) => (
              <div key={idx} style={{ background: "var(--navy-50)", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                <div className="flex justify-between items-center" style={{ fontSize: "0.8125rem" }}>
                  <span style={{ fontWeight: 600, color: "var(--navy-800)" }}>{cat.name}</span>
                  <Badge variant="indigo">{cat.weight} Weight</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Main Grid: Weekly Activity Chart + Daily Challenge */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.75rem", marginBottom: "2rem" }}>
        {/* Weekly Activity Visualizer */}
        <Card
          title="Weekly Placement Activity"
          subtitle="Hours dedicated and technical problems practiced this week"
          icon={BarChart3}
          action={
            <Link to="/weekly-report">
              <Button variant="ghost" size="sm">
                <span>Full Analytics</span>
                <ArrowRight size={14} />
              </Button>
            </Link>
          }
        >
          <div style={{ marginTop: "1rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                height: "170px",
                padding: "0.5rem 0.5rem 0",
                gap: "1rem",
                borderBottom: "1px solid var(--border-color)"
              }}
            >
              {weeklyData.map((item, idx) => {
                const heightPct = Math.round((item.hours / 5.5) * 100);
                const isMax = item.hours >= 4.0;
                return (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "0.5rem",
                      flex: 1
                    }}
                  >
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--navy-600)" }}>
                      {item.hours}h
                    </span>
                    <div
                      style={{
                        width: "100%",
                        maxWidth: "42px",
                        height: `${heightPct}%`,
                        background: isMax
                          ? "linear-gradient(180deg, var(--indigo-500) 0%, var(--indigo-700) 100%)"
                          : "linear-gradient(180deg, #c7d2fe 0%, #a5b4fc 100%)",
                        borderRadius: "6px 6px 0 0",
                        transition: "height 0.3s ease"
                      }}
                      title={`${item.day}: ${item.hours} hrs, ${item.questions} questions`}
                    />
                    <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--navy-500)" }}>
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between" style={{ marginTop: "1rem", fontSize: "0.8125rem", color: "var(--navy-500)" }}>
              <div>
                Total time logged: <strong>21.5 Hours</strong>
              </div>
              <div>
                Total questions solved: <strong>36 Problems</strong>
              </div>
            </div>
          </div>
        </Card>

        {/* Daily Challenge Card */}
        <Card
          title="Question of the Day"
          subtitle="Curated for your current target role"
          icon={Sparkles}
        >
          <div style={{ background: "var(--navy-50)", padding: "1.25rem", borderRadius: "10px", marginTop: "0.5rem", border: "1px solid var(--border-color)" }}>
            <div className="flex justify-between items-center" style={{ marginBottom: "0.5rem" }}>
              <Badge variant="indigo">{dailyChallenge.category}</Badge>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--amber-600)" }}>
                {dailyChallenge.rewardPoints}
              </span>
            </div>
            <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--navy-900)", marginBottom: "0.5rem" }}>
              {dailyChallenge.title}
            </h4>
            <div className="flex items-center gap-3" style={{ fontSize: "0.8125rem", color: "var(--navy-500)", marginBottom: "1.25rem" }}>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {dailyChallenge.timeEst}
              </span>
              <span>•</span>
              <span style={{ color: "var(--amber-600)", fontWeight: 600 }}>{dailyChallenge.difficulty}</span>
            </div>

            <Link to="/question-bank">
              <Button size="sm" variant="primary" style={{ width: "100%" }}>
                Solve in Question Bank
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Second Row: Upcoming Mock Interviews & Recent AI Feedback */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.75rem" }}>
        {/* Upcoming Mock Interviews */}
        <Card
          title="Scheduled Mock Interviews"
          subtitle="Calibrated for your target role"
          icon={Calendar}
          action={
            <Link to="/interview-coach">
              <Button size="sm" variant="outline">
                New Mock Round
              </Button>
            </Link>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "0.75rem" }}>
            {upcoming.map((u) => (
              <div
                key={u.id}
                style={{
                  border: "1px solid var(--border-color)",
                  borderRadius: "10px",
                  padding: "1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#ffffff"
                }}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <strong style={{ fontSize: "0.9375rem", color: "var(--navy-900)" }}>{u.role}</strong>
                    <Badge variant="indigo">{u.badge}</Badge>
                  </div>
                  <div style={{ fontSize: "0.8125rem", color: "var(--navy-500)", marginTop: "0.25rem" }}>
                    {u.type} • {u.scheduledDate} ({u.duration})
                  </div>
                </div>

                <Link to="/interview-coach">
                  <Button size="sm" variant="primary">
                    Join Room
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Performance & Feedback */}
        <Card
          title="Recent AI Performance Reviews"
          subtitle="Click to view detailed line-by-line critique"
          icon={Award}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", marginTop: "0.75rem" }}>
            {mockInterviews.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => handleOpenFeedback(item)}
                style={{
                  border: "1px solid var(--border-color)",
                  borderRadius: "10px",
                  padding: "0.875rem 1rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  background: "#ffffff"
                }}
                className="card-hover"
              >
                <div className="flex justify-between items-center" style={{ marginBottom: "0.25rem" }}>
                  <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--navy-900)" }}>
                    {item.title}
                  </div>
                  <Badge variant={item.score >= 88 ? "emerald" : "indigo"}>
                    {item.score}/100
                  </Badge>
                </div>
                <div className="flex justify-between items-center" style={{ fontSize: "0.75rem", color: "var(--navy-500)" }}>
                  <span>{item.category} • {item.date}</span>
                  <span style={{ fontWeight: 600, color: "var(--indigo-600)" }}>{item.verdict}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Review Feedback Detail Modal */}
      {selectedFeedback && (
        <Modal
          isOpen={feedbackModalOpen}
          onClose={() => setFeedbackModalOpen(false)}
          title={`AI Evaluation: ${selectedFeedback.title}`}
          footer={
            <Button size="sm" variant="primary" onClick={() => setFeedbackModalOpen(false)}>
              Close Evaluation
            </Button>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="flex justify-between items-center" style={{ background: "var(--navy-50)", padding: "1rem", borderRadius: "8px" }}>
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--navy-500)" }}>Rubric Score</div>
                <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--indigo-600)" }}>
                  {selectedFeedback.score}/100
                </div>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--navy-500)" }}>AI Hiring Recommendation</div>
                <Badge variant="emerald" style={{ fontSize: "0.875rem", padding: "0.35rem 0.75rem" }}>
                  {selectedFeedback.verdict}
                </Badge>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--navy-900)", marginBottom: "0.35rem" }}>
                Key Technical & Delivery Highlights:
              </h4>
              <p style={{ fontSize: "0.875rem", color: "var(--navy-600)", lineHeight: 1.6 }}>
                {selectedFeedback.highlights}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
