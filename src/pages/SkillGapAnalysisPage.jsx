import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Target,
  BarChart2,
  ShieldCheck,
  Plus
} from "lucide-react";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { useApp } from "../context/AppContext";

export const SkillGapAnalysisPage = () => {
  const { currentRole, skillGapData, showToast } = useApp();
  const navigate = useNavigate();

  const handleActionClick = (action) => {
    showToast(`Added "${action.title}" to your personalized roadmap!`);
    navigate("/roadmap");
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1>
            <TrendingUp size={28} color="var(--indigo-600)" />
            <span>Target Role Skill Gap Analysis</span>
          </h1>
          <p>
            Algorithmic benchmark comparison of your engineering competencies against Tier-1 campus placement hiring standards.
          </p>
        </div>

        <div className="page-actions">
          <Link to="/career-roles">
            <Button variant="outline">
              <span>Change Target Role</span>
            </Button>
          </Link>
          <Link to="/roadmap">
            <Button variant="primary">
              <span>View 8-Week Roadmap</span>
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </div>

      {/* Target Benchmark Overview Card */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%)",
          color: "#ffffff",
          borderRadius: "16px",
          padding: "2rem",
          marginBottom: "2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1.5rem"
        }}
      >
        <div>
          <Badge variant="indigo" style={{ marginBottom: "0.5rem" }}>Role Benchmark Model v2.4</Badge>
          <h2 style={{ fontSize: "1.625rem", fontWeight: 800, color: "#ffffff", marginBottom: "0.35rem" }}>
            Target: {currentRole.title}
          </h2>
          <p style={{ color: "#c7d2fe", fontSize: "0.875rem", margin: 0, maxWidth: "540px" }}>
            Benchmark calibrated against recent hiring rubrics from Amazon, Google, Flipkart, and high-growth FinTech unicorns.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.8125rem", color: "#a5b4fc" }}>Current Readiness Index</div>
            <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "#ffffff", lineHeight: 1 }}>
              {skillGapData.overallMatchScore}%
            </div>
            <div style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: 600, marginTop: "0.25rem" }}>
              High Probability of Tier-1 Shortlist
            </div>
          </div>
        </div>
      </div>

      {/* Skill Proficiency Gap Comparison List */}
      <Card title="Skill Proficiency Comparison vs Market Benchmark" subtitle="Green indicates meeting or exceeding requirements; Amber/Rose indicates priority gaps" style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginTop: "1rem" }}>
          {skillGapData.benchmarks.map((item, idx) => {
            const hasGap = item.studentProficiency < item.marketBenchmark;
            const gapDiff = item.marketBenchmark - item.studentProficiency;
            const badgeVariant =
              item.status === "Exceeds" ? "emerald" : item.status === "On Track" ? "indigo" : item.status === "Needs Attention" ? "rose" : "amber";

            return (
              <div
                key={idx}
                style={{
                  paddingBottom: "1.25rem",
                  borderBottom: idx < skillGapData.benchmarks.length - 1 ? "1px solid var(--border-color)" : "none"
                }}
              >
                <div className="flex items-center justify-between" style={{ marginBottom: "0.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
                  <div>
                    <strong style={{ fontSize: "1rem", color: "var(--navy-900)" }}>{item.skill}</strong>
                    <div style={{ fontSize: "0.8125rem", color: "var(--navy-500)", marginTop: "0.15rem" }}>
                      {item.tips}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: "0.8125rem", color: "var(--navy-600)" }}>
                      Student: <strong>{item.studentProficiency}%</strong> • Benchmark: <strong>{item.marketBenchmark}%</strong>
                    </span>
                    <Badge variant={badgeVariant}>{item.status}</Badge>
                  </div>
                </div>

                {/* Comparative Double Meter */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <div style={{ position: "relative", height: "10px", background: "var(--navy-100)", borderRadius: "999px", overflow: "hidden" }}>
                    {/* Benchmark marker line */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: `${item.marketBenchmark}%`,
                        width: "3px",
                        background: "#0f172a",
                        zIndex: 2
                      }}
                      title={`Market Benchmark: ${item.marketBenchmark}%`}
                    />
                    {/* Student progress fill */}
                    <div
                      style={{
                        height: "100%",
                        width: `${item.studentProficiency}%`,
                        background: hasGap
                          ? gapDiff > 10
                            ? "var(--rose-500)"
                            : "var(--amber-500)"
                          : "linear-gradient(90deg, var(--indigo-600), var(--emerald-500))",
                        borderRadius: "999px",
                        transition: "width 0.4s ease"
                      }}
                    />
                  </div>

                  <div className="flex justify-between" style={{ fontSize: "0.7rem", color: "var(--navy-400)" }}>
                    <span>0%</span>
                    <span>Market Target: {item.marketBenchmark}%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Immediate Recommended Actions */}
      <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--navy-900)", marginBottom: "1rem" }}>
        Automated Interventions to Close Your Highest Priority Gaps
      </h3>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.25rem" }}>
        {skillGapData.recommendedActions.map((act) => (
          <Card key={act.id} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div className="flex justify-between items-center" style={{ marginBottom: "0.5rem" }}>
                <Badge variant={act.priority === "Urgent" ? "rose" : "amber"}>
                  {act.priority} Priority
                </Badge>
                <span style={{ fontSize: "0.75rem", color: "var(--navy-500)", fontWeight: 600 }}>
                  Est: {act.estTime}
                </span>
              </div>
              <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--navy-900)", marginBottom: "0.75rem" }}>
                {act.title}
              </h4>
            </div>

            <Button
              size="sm"
              variant="primary"
              style={{ width: "100%", marginTop: "1rem" }}
              onClick={() => handleActionClick(act)}
            >
              <Plus size={14} />
              <span>{act.actionText}</span>
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
