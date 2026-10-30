import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Code2,
  Laptop,
  BrainCircuit,
  Settings,
  Activity,
  Radio,
  Zap,
  Building2,
  Compass,
  CheckCircle2,
  ArrowRight,
  Users,
  Briefcase,
  Sparkles,
  Shuffle
} from "lucide-react";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { useApp } from "../context/AppContext";

const iconMap = {
  Code2,
  Laptop,
  BrainCircuit,
  Settings,
  Activity,
  Radio,
  Zap,
  Building2,
  Compass
};

export const DepartmentSelectionPage = () => {
  const {
    departments,
    selectedDeptId,
    selectDepartment,
    currentDepartment,
    currentRole,
    crossDisciplinaryInfo
  } = useApp();
  const navigate = useNavigate();

  const handleSelect = (deptId) => {
    selectDepartment(deptId);
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1>
            <Building2 size={26} color="var(--indigo-600)" />
            <span>Academic Department Selection</span>
          </h1>
          <p>
            Choose your engineering branch. CareerCoach AI allows students from any department to pursue traditional or cross-disciplinary career tracks.
          </p>
        </div>

        <div className="page-actions">
          <Link to="/career-roles">
            <Button variant="primary">
              <span>Explore 20+ Career Roles</span>
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </div>

      {/* Active selection banner */}
      <div
        style={{
          background: "linear-gradient(90deg, #1e1b4b 0%, #312e81 100%)",
          color: "#ffffff",
          borderRadius: "14px",
          padding: "1.25rem 1.75rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem"
        }}
      >
        <div className="flex items-center gap-3">
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "12px",
              background: "var(--indigo-600)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
            }}
          >
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div style={{ fontSize: "0.8125rem", color: "#c7d2fe", fontWeight: 600 }}>
              ACTIVE STUDENT DEPARTMENT
            </div>
            <div style={{ fontSize: "1.25rem", fontWeight: 800 }}>
              {currentDepartment.name}
            </div>
            <div style={{ fontSize: "0.8125rem", color: "#a5b4fc", marginTop: "0.2rem" }}>
              Target Role: <strong>{currentRole.title}</strong>
              {crossDisciplinaryInfo.isCross ? (
                <span style={{ marginLeft: "0.5rem", color: "#fef08a", fontWeight: 700 }}>
                  (Cross-Disciplinary Pathway Active)
                </span>
              ) : (
                <span style={{ marginLeft: "0.5rem", color: "#6ee7b7", fontWeight: 700 }}>
                  (Direct Branch Fit)
                </span>
              )}
            </div>
          </div>
        </div>

        <Link to="/career-roles">
          <Button variant="outline" size="sm" style={{ color: "#ffffff", borderColor: "rgba(255,255,255,0.3)" }}>
            <Briefcase size={14} />
            <span>View Suggested Roles</span>
          </Button>
        </Link>
      </div>

      {/* Department Cards Grid (9 Exact Departments) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.5rem" }}>
        {departments.map((dept) => {
          const Icon = iconMap[dept.icon] || Code2;
          const isSelected = selectedDeptId === dept.id;

          return (
            <Card
              key={dept.id}
              style={{
                border: isSelected ? "2px solid var(--indigo-600)" : "1px solid var(--border-color)",
                boxShadow: isSelected ? "0 10px 25px -5px rgba(79, 70, 229, 0.18)" : "var(--shadow-sm)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "1.5rem"
              }}
            >
              <div>
                <div className="flex items-start justify-between" style={{ marginBottom: "1rem" }}>
                  <div className="flex items-center gap-3">
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "12px",
                        background: isSelected ? "var(--indigo-600)" : "var(--navy-100)",
                        color: isSelected ? "#ffffff" : "var(--navy-800)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Icon size={22} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--navy-900)" }}>
                        {dept.name}
                      </h3>
                      <Badge variant={isSelected ? "indigo" : "slate"}>{dept.code}</Badge>
                    </div>
                  </div>

                  {isSelected && (
                    <Badge variant="emerald">
                      <CheckCircle2 size={12} />
                      Active
                    </Badge>
                  )}
                </div>

                <p style={{ fontSize: "0.875rem", color: "var(--navy-600)", lineHeight: 1.5, marginBottom: "1.25rem" }}>
                  {dept.description}
                </p>

                {/* Core subjects */}
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--navy-400)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
                    Core Tested Subjects
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                    {dept.coreSubjects.map((sub, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: "0.75rem",
                          background: "var(--navy-50)",
                          border: "1px solid var(--border-color)",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "6px",
                          color: "var(--navy-700)"
                        }}
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between" style={{ paddingTop: "1rem", borderTop: "1px solid var(--border-subtle)" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--navy-500)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <Users size={14} />
                  {dept.activeStudents}
                </span>

                <Button
                  size="sm"
                  variant={isSelected ? "secondary" : "outline"}
                  onClick={() => handleSelect(dept.id)}
                >
                  {isSelected ? "Selected" : "Select Department"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
