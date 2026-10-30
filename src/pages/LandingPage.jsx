import React from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Bot,
  Mic,
  TrendingUp,
  Map,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Star,
  Users,
  Building,
  Award,
  ChevronRight,
  Cpu
} from "lucide-react";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { Badge } from "../components/common/Badge";

export const LandingPage = () => {
  const features = [
    {
      icon: Bot,
      color: "#6366f1",
      title: "Real-Time AI Technical Interviewer",
      desc: "Simulate live coding, system design, and algorithms rounds with voice-driven AI that asks dynamic follow-up questions and evaluates code complexity."
    },
    {
      icon: Mic,
      color: "#06b6d4",
      title: "Speech & Communication Coach",
      desc: "Detect speech pace (words per min), eliminate filler words ('um', 'like'), and perfect your STAR-format behavioral responses for leadership rounds."
    },
    {
      icon: TrendingUp,
      color: "#10b981",
      title: "Target Role Skill Gap Analysis",
      desc: "Benchmark your skills against real Tier-1 product company requirements and pinpoint exact gaps in Data Structures, Databases, and Design."
    },
    {
      icon: Map,
      color: "#f59e0b",
      title: "Personalized 8-Week Roadmaps",
      desc: "Get an adaptive week-by-week study plan tailored to your graduation year, target engineering department, and dream company tier."
    }
  ];

  const steps = [
    {
      num: "01",
      title: "Select Department & Target Role",
      desc: "Choose from 7 engineering disciplines (CSE, AI&DS, ECE, EEE, etc.) and your target role (Full-Stack, Backend, AI/ML)."
    },
    {
      num: "02",
      title: "Run Baseline Diagnostic Assessment",
      desc: "Our AI evaluates your current proficiency across core computer science subjects, problem solving, and spoken clarity."
    },
    {
      num: "03",
      title: "Practice Realistic Mock Rounds",
      desc: "Conduct voice and video simulated technical interviews with instant line-by-line feedback and rubric scoring."
    },
    {
      num: "04",
      title: "Track Mastery & Crack Campus Offers",
      desc: "Monitor weekly velocity reports, close all skill gaps, and step into company campus recruitment drives with peak confidence."
    }
  ];

  const stats = [
    { value: "45,000+", label: "Mock Interviews Completed" },
    { value: "94.2%", label: "Placement Offer Conversion" },
    { value: "₹18.4 LPA", label: "Average Tier-1 CTC Achieved" },
    { value: "250+", label: "Partner Engineering Colleges" }
  ];

  return (
    <div style={{ background: "var(--navy-950)", color: "#ffffff", overflow: "hidden" }}>
      {/* Hero Section */}
      <section
        style={{
          position: "relative",
          padding: "5rem 0 6rem",
          background: "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(79, 70, 229, 0.35), transparent 70%)"
        }}
      >
        <div className="container" style={{ textAlign: "center", position: "relative", zIndex: 10 }}>
          <div style={{ display: "inline-flex", marginBottom: "1.5rem" }}>
            <Badge variant="indigo" style={{ padding: "0.4rem 1rem", fontSize: "0.8125rem", borderRadius: "999px" }}>
              <Sparkles size={14} />
              <span>Next-Gen Placement Intelligence for Engineering Students</span>
            </Badge>
          </div>

          <h1
            style={{
              fontSize: "clamp(2.25rem, 5vw, 3.85rem)",
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              maxWidth: "960px",
              margin: "0 auto 1.5rem",
              background: "linear-gradient(180deg, #ffffff 30%, #cbd5e1 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            Crack Your Dream Campus Placement with an AI Interview Coach
          </h1>

          <p
            style={{
              fontSize: "clamp(1.05rem, 2vw, 1.25rem)",
              color: "var(--navy-300)",
              maxWidth: "760px",
              margin: "0 auto 2.5rem",
              lineHeight: 1.6
            }}
          >
            Personalized mock technical interviews, instant speech & behavioral analytics, and automated skill-gap roadmaps built specifically for engineering undergraduates.
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              flexWrap: "wrap",
              marginBottom: "3.5rem"
            }}
          >
            <Link to="/register">
              <Button size="lg" variant="primary">
                <span>Start Free Practice Now</span>
                <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" style={{ color: "#ffffff", borderColor: "rgba(255,255,255,0.2)" }}>
                <span>Explore Live Demo Workspace</span>
              </Button>
            </Link>
          </div>

          {/* Interactive UI Mock Preview */}
          <div
            style={{
              maxWidth: "1050px",
              margin: "0 auto",
              borderRadius: "16px",
              padding: "8px",
              background: "linear-gradient(135deg, rgba(99, 102, 241, 0.4), rgba(6, 182, 212, 0.2))",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)"
            }}
          >
            <div
              style={{
                background: "#0d1424",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                padding: "1.5rem",
                textAlign: "left"
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                  paddingBottom: "1rem",
                  marginBottom: "1.25rem"
                }}
              >
                <div className="flex items-center gap-2">
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b" }} />
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10b981" }} />
                  <span style={{ fontSize: "0.8125rem", color: "#94a3b8", marginLeft: "0.5rem" }}>
                    AI Mock Interview Simulator — Live Feedback Active
                  </span>
                </div>
                <Badge variant="emerald">AI Audio Analyzing</Badge>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
                <div style={{ background: "rgba(15, 23, 42, 0.8)", padding: "1.25rem", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                  <div style={{ fontSize: "0.75rem", color: "#818cf8", fontWeight: 700, marginBottom: "0.5rem" }}>
                    CURRENT INTERVIEW QUESTION #3
                  </div>
                  <div style={{ fontSize: "1rem", fontWeight: 600, color: "#ffffff", marginBottom: "0.75rem" }}>
                    "How does Redis implement LRU memory eviction, and how would you handle cache penetration?"
                  </div>
                  <div style={{ fontSize: "0.8125rem", color: "#94a3b8", lineHeight: 1.5 }}>
                    Target Role: Full-Stack Engineer • Level: Tier-1 Product Round
                  </div>
                </div>

                <div style={{ background: "rgba(15, 23, 42, 0.8)", padding: "1.25rem", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                  <div style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: 700, marginBottom: "0.5rem" }}>
                    REAL-TIME AI SPEECH & ACCURACY TELEMETRY
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.8125rem" }}>
                    <span>Technical Accuracy:</span>
                    <strong style={{ color: "#10b981" }}>94% (Exceptional)</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.8125rem" }}>
                    <span>Speaking Pacing:</span>
                    <strong style={{ color: "#6366f1" }}>134 wpm (Optimal)</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem" }}>
                    <span>Filler Words ('um', 'like'):</span>
                    <strong style={{ color: "#06b6d4" }}>2 detected (Low)</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", background: "#0b101e", padding: "2.5rem 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem", textAlign: "center" }}>
            {stats.map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: "2.25rem", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em" }}>
                  {s.value}
                </div>
                <div style={{ fontSize: "0.875rem", color: "var(--navy-400)", marginTop: "0.25rem" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section id="features" style={{ padding: "6rem 0", background: "var(--navy-950)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 4rem" }}>
            <Badge variant="indigo" style={{ marginBottom: "1rem" }}>Everything You Need To Get Placed</Badge>
            <h2 style={{ fontSize: "2.25rem", fontWeight: 800, letterSpacing: "-0.02em", color: "#ffffff", marginBottom: "1rem" }}>
              Engineered Specifically For Campus Placement Success
            </h2>
            <p style={{ color: "var(--navy-400)", fontSize: "1rem" }}>
              Standard prep websites give you static flashcards. CareerCoach AI gives you an interactive, adaptive personal placement mentor.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.75rem" }}>
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  style={{
                    background: "rgba(30, 41, 59, 0.4)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "16px",
                    padding: "2rem",
                    transition: "transform 0.2s ease, border-color 0.2s ease"
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "12px",
                      background: `rgba(${f.color === "#6366f1" ? "99, 102, 241" : f.color === "#06b6d4" ? "6, 182, 212" : f.color === "#10b981" ? "16, 185, 129" : "245, 158, 11"}, 0.15)`,
                      color: f.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1.25rem"
                    }}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.75rem" }}>
                    {f.title}
                  </h3>
                  <p style={{ color: "var(--navy-400)", fontSize: "0.875rem", lineHeight: 1.6 }}>
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Workflow */}
      <section id="how-it-works" style={{ padding: "6rem 0", background: "#0c1222", borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 4rem" }}>
            <Badge variant="cyan" style={{ marginBottom: "1rem" }}>4-Step Placement Roadmap</Badge>
            <h2 style={{ fontSize: "2.25rem", fontWeight: 800, letterSpacing: "-0.02em", color: "#ffffff" }}>
              How CareerCoach AI Accelerates Your Prep
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "2rem" }}>
            {steps.map((st, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(15, 23, 42, 0.6)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "14px",
                  padding: "1.75rem",
                  position: "relative"
                }}
              >
                <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--indigo-500)", opacity: 0.8, marginBottom: "0.75rem" }}>
                  {st.num}
                </div>
                <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.5rem" }}>
                  {st.title}
                </h4>
                <p style={{ fontSize: "0.875rem", color: "var(--navy-400)", lineHeight: 1.5 }}>
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call To Action */}
      <section style={{ padding: "6rem 0", background: "radial-gradient(ellipse at bottom, rgba(99, 102, 241, 0.25), transparent 70%)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#ffffff", marginBottom: "1rem" }}>
            Ready to Secure Your Campus Placement Offer?
          </h2>
          <p style={{ color: "var(--navy-300)", fontSize: "1.125rem", maxWidth: "600px", margin: "0 auto 2.5rem" }}>
            Join ambitious engineering students who transformed their interview nervousness into confident dream offers.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/register">
              <Button size="lg" variant="primary">
                Create Free Account
                <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" style={{ color: "#ffffff", borderColor: "rgba(255,255,255,0.2)" }}>
                Launch Demo Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
