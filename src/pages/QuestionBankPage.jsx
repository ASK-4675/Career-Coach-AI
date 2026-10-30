import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Search,
  Bot,
  Layers,
  Sparkles,
  HelpCircle,
  FileCheck2,
  ChevronRight,
  Filter,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { Modal } from "../components/common/Modal";
import { EmptyState } from "../components/common/EmptyState";
import { useApp } from "../context/AppContext";
import { questionBankApi } from "../services/api";

export const QuestionBankPage = () => {
  const { departments, showToast } = useApp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedType, setSelectedType] = useState("All");

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(null);

  const categories = [
    "All",
    "Self-Introduction",
    "HR Interview",
    "Communication & Behavioral",
    "Aptitude & Reasoning",
    "Programming & DSA",
    "Web Development",
    "Database & SQL",
    "Networking, OS & Systems",
    "Mechanical Engineering",
    "Biomedical Engineering",
    "Electronics & Communication",
    "Electrical Engineering",
    "Civil Engineering",
    "AI & Data Science",
    "Cybersecurity",
    "Cloud & DevOps"
  ];

  const types = ["All", "hr", "technical", "behavioral", "aptitude"];
  const difficulties = ["All", "Easy", "Medium", "Hard"];

  useEffect(() => {
    let isMounted = true;
    async function fetchQuestions() {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        if (selectedCategory !== "All") params.category = selectedCategory;
        if (selectedDifficulty !== "All") params.difficulty = selectedDifficulty.toLowerCase();
        if (selectedDepartment !== "All") params.department_id = selectedDepartment.toLowerCase();
        if (selectedType !== "All") params.type = selectedType;
        if (search.trim()) params.search = search.trim();

        const data = await questionBankApi.getQuestions(params);
        if (isMounted) {
          setQuestions(data.questions || []);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error loading questions:", err);
          setError("Could not load questions from the server. Please try again.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchQuestions();
    }, 200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [selectedCategory, selectedDifficulty, selectedDepartment, selectedType, search]);

  const handleOpenDetail = (q) => {
    setActiveQuestion(q);
    setDetailModalOpen(true);
  };

  const handlePracticeWithAI = (q) => {
    setDetailModalOpen(false);
    showToast(`Loading question into AI Interview Coach...`);
    navigate(`/interview-coach?questionId=${q.id}`);
  };

  const getDifficultyBadge = (diff) => {
    switch (diff?.toLowerCase()) {
      case "easy":
        return <Badge variant="emerald">Easy</Badge>;
      case "medium":
        return <Badge variant="amber">Medium</Badge>;
      case "hard":
        return <Badge variant="rose">Hard</Badge>;
      default:
        return <Badge variant="indigo">{diff}</Badge>;
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1>
            <BookOpen size={28} color="var(--indigo-600)" />
            <span>Campus Placement Question Bank</span>
          </h1>
          <p>
            Master curated technical, behavioral, aptitude, and department-specific engineering interview questions with reference answers and evaluation rubrics.
          </p>
        </div>

        <div className="page-actions">
          <Button variant="primary" onClick={() => navigate("/interview-coach")}>
            <Bot size={16} />
            <span>Start AI Mock Interview</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card style={{ padding: "1.25rem 1.5rem", marginBottom: "1.75rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Top row: search & primary filters */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ maxWidth: "380px", width: "100%" }}>
              <div className="search-box">
                <Search size={16} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search questions, algorithms, formulas..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Department filter */}
              <div className="flex items-center gap-1">
                <span style={{ fontSize: "0.8125rem", color: "var(--navy-600)", fontWeight: 600 }}>Branch:</span>
                <select
                  className="form-select form-select-sm"
                  style={{ width: "auto", fontSize: "0.8125rem", padding: "0.35rem 0.65rem" }}
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  <option value="All">All Branches</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.code} - {d.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty filter */}
              <div className="flex items-center gap-1">
                <span style={{ fontSize: "0.8125rem", color: "var(--navy-600)", fontWeight: 600 }}>Difficulty:</span>
                {difficulties.map((d) => (
                  <button
                    key={d}
                    type="button"
                    className={`btn btn-sm ${selectedDifficulty === d ? "btn-secondary" : "btn-outline"}`}
                    style={{ padding: "0.3rem 0.65rem", fontSize: "0.75rem" }}
                    onClick={() => setSelectedDifficulty(d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", borderTop: "1px solid var(--border-subtle)", paddingTop: "0.75rem" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`btn btn-sm ${selectedCategory === cat ? "btn-primary" : "btn-ghost"}`}
                style={{ padding: "0.3rem 0.65rem", fontSize: "0.75rem" }}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Questions Count & Loading */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <span style={{ fontSize: "0.875rem", color: "var(--navy-600)", fontWeight: 600 }}>
          {loading ? "Loading questions..." : `Showing ${questions.length} questions`}
        </span>
        <span style={{ fontSize: "0.8125rem", color: "var(--navy-500)" }}>
          Targeted for On-Campus Placements & Technical Rounds
        </span>
      </div>

      {error && (
        <Card style={{ padding: "1.5rem", textAlign: "center", color: "var(--rose-600)", marginBottom: "1.5rem" }}>
          {error}
        </Card>
      )}

      {/* Question List */}
      {!loading && questions.length === 0 ? (
        <EmptyState
          title="No questions match your filter"
          description="Try clearing search filters or selecting 'All' in categories and difficulty."
          actionText="Clear All Filters"
          onAction={() => {
            setSearch("");
            setSelectedCategory("All");
            setSelectedDifficulty("All");
            setSelectedDepartment("All");
            setSelectedType("All");
          }}
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {questions.map((q) => (
            <Card
              key={q.id}
              className="hover-card"
              style={{
                padding: "1.25rem 1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <Badge variant="indigo">{q.category}</Badge>
                  <span
                    style={{
                      textTransform: "uppercase",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      padding: "0.2rem 0.5rem",
                      borderRadius: "6px",
                      background: "var(--navy-100)",
                      color: "var(--navy-700)"
                    }}
                  >
                    {q.interview_type}
                  </span>
                  {q.department_id && q.department_id !== "all" && (
                    <Badge variant="blue">{q.department_id.toUpperCase()}</Badge>
                  )}
                  {getDifficultyBadge(q.difficulty)}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenDetail(q)}
                  >
                    <span>View Reference & Rubric</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handlePracticeWithAI(q)}
                  >
                    <Bot size={14} />
                    <span>Practice in AI Coach</span>
                  </Button>
                </div>
              </div>

              <div style={{ fontSize: "1rem", fontWeight: 600, color: "var(--navy-900)", lineHeight: 1.5 }}>
                {q.question_text}
              </div>

              {q.reference_answer && (
                <div style={{ fontSize: "0.8125rem", color: "var(--navy-600)", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  <strong>Key Criteria:</strong> {q.reference_answer}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Question Detail Modal */}
      {activeQuestion && (
        <Modal
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          title={activeQuestion.category}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <Badge variant="indigo">{activeQuestion.category}</Badge>
              <Badge variant="blue">{activeQuestion.interview_type.toUpperCase()}</Badge>
              {getDifficultyBadge(activeQuestion.difficulty)}
              {activeQuestion.department_id && activeQuestion.department_id !== "all" && (
                <Badge variant="emerald">Dept: {activeQuestion.department_id.toUpperCase()}</Badge>
              )}
            </div>

            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--navy-400)", textTransform: "uppercase", marginBottom: "0.35rem" }}>
                Question Text
              </div>
              <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--navy-900)", lineHeight: 1.5 }}>
                {activeQuestion.question_text}
              </div>
            </div>

            {activeQuestion.reference_answer && (
              <div style={{ background: "var(--indigo-50)", border: "1px solid var(--indigo-200)", padding: "1rem", borderRadius: "8px" }}>
                <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--indigo-900)", marginBottom: "0.35rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <FileCheck2 size={16} />
                  <span>Reference Answer / Expected Criteria</span>
                </div>
                <div style={{ fontSize: "0.875rem", color: "var(--indigo-950)", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                  {activeQuestion.reference_answer}
                </div>
              </div>
            )}

            {activeQuestion.evaluation_rubric && (
              <div style={{ background: "var(--amber-50)", border: "1px solid var(--amber-200)", padding: "1rem", borderRadius: "8px" }}>
                <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--amber-900)", marginBottom: "0.35rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Sparkles size={16} />
                  <span>Evaluation Rubric</span>
                </div>
                <div style={{ fontSize: "0.8125rem", color: "var(--amber-950)", lineHeight: 1.5 }}>
                  {activeQuestion.evaluation_rubric}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3" style={{ marginTop: "1rem" }}>
              <Button variant="outline" onClick={() => setDetailModalOpen(false)}>
                Close
              </Button>
              <Button variant="primary" onClick={() => handlePracticeWithAI(activeQuestion)}>
                <Bot size={16} />
                <span>Practice this in AI Coach</span>
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
