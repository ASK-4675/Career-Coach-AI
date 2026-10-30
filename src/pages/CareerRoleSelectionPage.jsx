import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Briefcase,
  Search,
  CheckCircle2,
  TrendingUp,
  Building,
  ArrowRight,
  Filter,
  Sparkles,
  Shuffle,
  Compass,
  Star,
  Layers,
  GraduationCap
} from "lucide-react";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { useApp } from "../context/AppContext";

export const CareerRoleSelectionPage = () => {
  const {
    careerRoles,
    selectedRoleId,
    selectRole,
    currentRole,
    selectedDeptId,
    currentDepartment,
    crossDisciplinaryInfo,
    showToast
  } = useApp();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewFilter, setViewFilter] = useState("all"); // 'all', 'suggested', 'cross'

  const categories = [
    "All",
    "Software & Web Development",
    "Data & Artificial Intelligence",
    "Security & Infrastructure",
    "Core Engineering & Manufacturing",
    "Biomedical & Healthcare Tech",
    "Design & Product",
    "Business & Growth"
  ];

  const filteredRoles = careerRoles.filter((role) => {
    const query = search.toLowerCase();
    const matchesSearch =
      role.title.toLowerCase().includes(query) ||
      role.category.toLowerCase().includes(query) ||
      role.coreSkills.some((s) => s.toLowerCase().includes(query)) ||
      role.companiesHiring.some((c) => c.toLowerCase().includes(query));

    const matchesCategory =
      selectedCategory === "All" || role.category === selectedCategory;

    const isDirect = role.recommendedDepts.includes(selectedDeptId);
    const matchesViewFilter =
      viewFilter === "all" ||
      (viewFilter === "suggested" && isDirect) ||
      (viewFilter === "cross" && !isDirect);

    return matchesSearch && matchesCategory && matchesViewFilter;
  });

  const handleSelectRole = (roleId) => {
    selectRole(roleId);
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1>
            <Briefcase size={26} color="var(--indigo-600)" />
            <span>Career Role Catalog & Personalization</span>
          </h1>
          <p>
            Explore 20+ placement career profiles. You can select your branch's natural track or pursue any cross-disciplinary career without restriction.
          </p>
        </div>

        <div className="page-actions">
          <Link to="/dashboard">
            <Button variant="primary">
              <span>View Personalized Dashboard</span>
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </div>

      {/* Active selection banner with Cross-Disciplinary indicator */}
      <div
        style={{
          background: "linear-gradient(90deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%)",
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
        <div>
          <div className="flex items-center gap-2" style={{ marginBottom: "0.25rem" }}>
            <span className="demo-badge-pill" style={{ background: "rgba(255,255,255,0.15)", color: "#ffffff", borderColor: "rgba(255,255,255,0.3)" }}>
              Student Branch: {currentDepartment.shortName}
            </span>
            {crossDisciplinaryInfo.isCross ? (
              <Badge variant="amber" icon={Shuffle}>Cross-Disciplinary Pathway</Badge>
            ) : (
              <Badge variant="emerald" icon={CheckCircle2}>Direct Department Fit</Badge>
            )}
          </div>
          <div style={{ fontSize: "1.35rem", fontWeight: 800 }}>
            Target Role: {currentRole.title}
          </div>
          <div style={{ fontSize: "0.8125rem", color: "#c7d2fe", marginTop: "0.25rem", maxWidth: "600px", lineHeight: 1.4 }}>
            {crossDisciplinaryInfo.pathwayNotes}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/skill-gap">
            <Button variant="outline" size="sm" style={{ color: "#ffffff", borderColor: "rgba(255,255,255,0.3)" }}>
              <TrendingUp size={14} />
              <span>Analyze Gaps for {currentRole.title}</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Department Suggestion vs Cross-disciplinary quick filter */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <button
          className={`btn btn-sm ${viewFilter === "all" ? "btn-secondary" : "btn-outline"}`}
          onClick={() => setViewFilter("all")}
        >
          All 20+ Roles ({careerRoles.length})
        </button>
        <button
          className={`btn btn-sm ${viewFilter === "suggested" ? "btn-primary" : "btn-outline"}`}
          onClick={() => setViewFilter("suggested")}
        >
          <Star size={14} />
          <span>Recommended for {currentDepartment.shortName}</span>
        </button>
        <button
          className={`btn btn-sm ${viewFilter === "cross" ? "btn-secondary" : "btn-outline"}`}
          onClick={() => setViewFilter("cross")}
        >
          <Shuffle size={14} />
          <span>Cross-Disciplinary Careers</span>
        </button>
      </div>

      {/* Search and Category Filter Bar */}
      <Card style={{ padding: "1.25rem 1.5rem", marginBottom: "1.75rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              className="form-input"
              placeholder="Search by role title, skill (e.g. React, Python, CAD), or recruiter..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", borderTop: "1px solid var(--border-subtle)", paddingTop: "0.75rem" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`btn btn-sm ${selectedCategory === cat ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Role Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.5rem" }}>
        {filteredRoles.map((role) => {
          const isSelected = selectedRoleId === role.id;
          const isDirectFit = role.recommendedDepts.includes(selectedDeptId);

          return (
            <Card
              key={role.id}
              style={{
                border: isSelected ? "2px solid var(--indigo-600)" : "1px solid var(--border-color)",
                boxShadow: isSelected ? "0 10px 25px -5px rgba(79, 70, 229, 0.2)" : "var(--shadow-sm)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "1.5rem"
              }}
            >
              <div>
                {/* Header with Title and Pathway Badge */}
                <div className="flex items-start justify-between" style={{ marginBottom: "0.75rem", gap: "0.5rem" }}>
                  <div>
                    <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--navy-900)" }}>
                      {role.title}
                    </h3>
                    <div style={{ fontSize: "0.75rem", color: "var(--navy-500)", marginTop: "0.15rem" }}>
                      {role.category}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    {isDirectFit ? (
                      <Badge variant="emerald" size="sm">Direct Fit</Badge>
                    ) : (
                      <Badge variant="amber" size="sm">Cross-Branch</Badge>
                    )}
                    {isSelected && <Badge variant="indigo" size="sm">Active Target</Badge>}
                  </div>
                </div>

                {/* Salary and demand badges */}
                <div className="flex items-center gap-2" style={{ marginBottom: "1rem", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--emerald-600)" }}>
                    {role.avgPackage}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--navy-400)" }}>•</span>
                  <span style={{ fontSize: "0.75rem", color: "var(--navy-600)" }}>
                    Demand: <strong>{role.demandLevel}</strong>
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--navy-400)" }}>•</span>
                  <span style={{ fontSize: "0.75rem", color: "var(--navy-600)" }}>
                    Level: <strong>{role.difficulty}</strong>
                  </span>
                </div>

                {/* Description */}
                <p style={{ fontSize: "0.875rem", color: "var(--navy-600)", lineHeight: 1.5, marginBottom: "1.25rem" }}>
                  {role.description}
                </p>

                {/* Core Skills */}
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--navy-400)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
                    Core Required Competencies
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                    {role.coreSkills.map((skill, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: "0.75rem",
                          background: "#ffffff",
                          border: "1px solid var(--border-color)",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "6px",
                          color: "var(--navy-800)",
                          fontWeight: 500
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Preparation Categories Preview */}
                <div style={{ marginBottom: "1.25rem", background: "var(--navy-50)", padding: "0.75rem", borderRadius: "8px" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--indigo-900)", marginBottom: "0.4rem" }}>
                    Curriculum Preparation Modules
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    {role.preparationCategories.map((cat, i) => (
                      <div key={i} className="flex justify-between" style={{ fontSize: "0.75rem", color: "var(--navy-600)" }}>
                        <span>• {cat.name}</span>
                        <strong style={{ color: "var(--navy-800)" }}>{cat.weight}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="flex items-center justify-between" style={{ paddingTop: "1rem", borderTop: "1px solid var(--border-subtle)" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--navy-500)" }}>
                  Recruiters: {role.companiesHiring.slice(0, 3).join(", ")}
                </span>

                <Button
                  size="sm"
                  variant={isSelected ? "secondary" : "primary"}
                  onClick={() => handleSelectRole(role.id)}
                >
                  {isSelected ? "Currently Active" : "Set Target Role"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
