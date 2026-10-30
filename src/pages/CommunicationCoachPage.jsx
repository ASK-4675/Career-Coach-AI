import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Sparkles,
  Send,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  BookOpen,
  Award,
  ChevronRight,
  History,
  FileCheck2,
  HelpCircle,
  ThumbsUp,
  Layers,
  ArrowRight,
  TrendingUp,
  Sliders,
  Check,
  AlertTriangle,
  Lightbulb,
  Mic,
  Info
} from "lucide-react";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { useApp } from "../context/AppContext";
import { communicationApi } from "../services/api";

export const CommunicationCoachPage = () => {
  const { showToast } = useApp();

  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [selectedActivityId, setSelectedActivityId] = useState("self_intro");

  // Practice & Assessment State
  const [userResponseText, setUserResponseText] = useState("");
  const [practiceMode, setPracticeMode] = useState("text"); // 'text' | 'voice_preview'
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [evaluationError, setEvaluationError] = useState(null);

  // History & Progress State
  const [historyTabOpen, setHistoryTabOpen] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  const [statsData, setStatsData] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Fetch activities on mount
  useEffect(() => {
    let isMounted = true;
    communicationApi
      .getActivities()
      .then((res) => {
        if (isMounted) {
          setActivities(res.activities || []);
          setLoadingActivities(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Failed to load communication activities:", err);
          setLoadingActivities(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const activeActivity =
    activities.find((a) => a.id === selectedActivityId) || activities[0] || null;

  // Real-time Text Telemetry (Ground truth measurements only)
  const computeRealtimeMetrics = (text) => {
    const clean = (text || "").trim();
    if (!clean) return { words: 0, sentences: 0, deliverySec: 0, vocabPct: 0 };
    const wordsArr = clean.split(/\s+/).filter(Boolean);
    const sentencesArr = clean.split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.length > 0);
    const words = wordsArr.length;
    const sentences = Math.max(1, sentencesArr.length);
    const deliverySec = Math.round((words / 130) * 60);
    const unique = new Set(wordsArr.map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, "")));
    const vocabPct = words > 0 ? Math.round((unique.size / words) * 100) : 0;
    return { words, sentences, deliverySec, vocabPct };
  };

  const currentMetrics = computeRealtimeMetrics(userResponseText);

  // Select activity handler
  const handleSelectActivity = (act) => {
    setSelectedActivityId(act.id);
    setUserResponseText("");
    setEvaluationResult(null);
    setEvaluationError(null);
    setHistoryTabOpen(false);
  };

  // Pre-fill sample draft for testing
  const handlePreFillSample = () => {
    if (activeActivity?.sampleDraft) {
      setUserResponseText(activeActivity.sampleDraft);
      showToast("Loaded sample candidate draft!");
    }
  };

  // Submit response for evaluation and save to user profile
  const handleSubmitResponse = async (allowFallback = true) => {
    if (!userResponseText.trim()) {
      showToast("Please enter your draft response first.", "error");
      return;
    }

    setIsEvaluating(true);
    setEvaluationError(null);

    try {
      const res = await communicationApi.submitPractice(
        activeActivity.id,
        userResponseText,
        null,
        allowFallback
      );
      setEvaluationResult(res.evaluation);
      showToast("Communication assessed! Review your feedback below.");
      loadStatsAndHistory();
    } catch (err) {
      console.error("Communication evaluation failed:", err);
      setEvaluationError(err.message || "Evaluation service unavailable.");
    } finally {
      setIsEvaluating(false);
    }
  };

  // Load history and progression
  const loadStatsAndHistory = async () => {
    setLoadingHistory(true);
    try {
      const [histRes, statsRes] = await Promise.all([
        communicationApi.getHistory(),
        communicationApi.getStats()
      ]);
      setHistoryList(histRes.submissions || []);
      setStatsData(statsRes);
    } catch (e) {
      console.warn("Could not load communication history:", e);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleToggleHistory = () => {
    if (!historyTabOpen) {
      loadStatsAndHistory();
    }
    setHistoryTabOpen(!historyTabOpen);
  };

  const handleRetryActivity = () => {
    setEvaluationResult(null);
    setEvaluationError(null);
    showToast("Ready for retry. Refine your phrasing and resubmit!");
  };

  const getScoreBadgeClass = (score) => {
    if (score >= 80) return "emerald";
    if (score >= 60) return "indigo";
    if (score >= 40) return "amber";
    return "rose";
  };

  return (
    <div style={{ maxWidth: "1140px", margin: "0 auto", paddingBottom: "3rem" }}>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: "1.75rem" }}>
        <div className="page-header-text">
          <h1>
            <MessageSquare size={28} color="var(--indigo-600)" />
            <span>Campus Placement Communication Skills Coach</span>
          </h1>
          <p>
            Master self-introductions, technical storytelling, email writing, and behavioral clarity evaluated on grammar, vocabulary, organization, and professional tone.
          </p>
        </div>

        <div className="page-actions flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleHistory}
          >
            <History size={16} />
            <span>{historyTabOpen ? "Back to Practice" : "My Attempts & Progress"}</span>
          </Button>
        </div>
      </div>

      {/* Main Container: Layout with Activity Sidebar and Practice Panel */}
      {!historyTabOpen ? (
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: "1.5rem", alignItems: "start" }}>
          {/* Left Column: 10 Practice Activities Nav */}
          <div>
            <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--navy-500)", textTransform: "uppercase", marginBottom: "0.75rem" }}>
              Practice Activities (10 Modules)
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {activities.map((act) => {
                const isSelected = act.id === selectedActivityId;
                return (
                  <div
                    key={act.id}
                    onClick={() => handleSelectActivity(act)}
                    style={{
                      background: isSelected ? "var(--indigo-50)" : "#ffffff",
                      border: isSelected ? "2px solid var(--indigo-600)" : "1px solid var(--border-color)",
                      borderRadius: "10px",
                      padding: "0.875rem 1rem",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.35rem"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, color: isSelected ? "var(--indigo-700)" : "var(--navy-400)" }}>
                        Module #{act.number}
                      </span>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          padding: "0.15rem 0.45rem",
                          borderRadius: "4px",
                          background: isSelected ? "var(--indigo-200)" : "var(--navy-100)",
                          color: isSelected ? "var(--indigo-900)" : "var(--navy-600)"
                        }}
                      >
                        {act.category}
                      </span>
                    </div>

                    <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: isSelected ? "var(--indigo-950)" : "var(--navy-900)" }}>
                      {act.title}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Activity Practice Area */}
          <div>
            {activeActivity && (
              <>
                {/* Activity Prompt Card */}
                <Card style={{ padding: "1.75rem", marginBottom: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                    <div>
                      <div className="flex items-center gap-2" style={{ marginBottom: "0.25rem" }}>
                        <Badge variant="indigo">Module #{activeActivity.number}</Badge>
                        <Badge variant="blue">{activeActivity.category}</Badge>
                        <span className="demo-badge-pill">{activeActivity.badge}</span>
                      </div>
                      <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--navy-900)" }}>
                        {activeActivity.title}
                      </h2>
                    </div>

                    <Button size="sm" variant="ghost" onClick={handlePreFillSample}>
                      <span>Pre-fill Sample Draft</span>
                    </Button>
                  </div>

                  <p style={{ fontSize: "0.9375rem", color: "var(--navy-800)", lineHeight: 1.6, background: "var(--navy-50)", padding: "1rem", borderRadius: "8px", marginBottom: "1.25rem" }}>
                    {activeActivity.prompt}
                  </p>

                  {/* Guidelines Checklist */}
                  <div>
                    <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--navy-600)", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                      Coach Guidelines & Criteria
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                      {activeActivity.guidelines.map((g, idx) => (
                        <div key={idx} className="flex items-center gap-2" style={{ fontSize: "0.8125rem", color: "var(--navy-700)" }}>
                          <CheckCircle2 size={14} color="var(--indigo-600)" style={{ flexShrink: 0 }} />
                          <span>{g}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Mode Selector Tabs */}
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                  <button
                    type="button"
                    className={`btn btn-sm ${practiceMode === "text" ? "btn-primary" : "btn-outline"}`}
                    onClick={() => setPracticeMode("text")}
                  >
                    <span>Text Practice (Active Phase)</span>
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${practiceMode === "voice_preview" ? "btn-secondary" : "btn-outline"}`}
                    onClick={() => setPracticeMode("voice_preview")}
                  >
                    <Mic size={14} />
                    <span>Voice Practice Mode (Preview / Future Phase)</span>
                  </button>
                </div>

                {/* Voice Mode Future Information Banner */}
                {practiceMode === "voice_preview" && (
                  <div
                    style={{
                      background: "var(--amber-50)",
                      border: "1px solid var(--amber-300)",
                      padding: "1rem 1.25rem",
                      borderRadius: "8px",
                      marginBottom: "1.25rem",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.75rem"
                    }}
                  >
                    <Info size={20} color="var(--amber-700)" style={{ flexShrink: 0, marginTop: "2px" }} />
                    <div>
                      <strong style={{ fontSize: "0.875rem", color: "var(--amber-900)" }}>
                        Voice Practice Mode is in Active Preparation
                      </strong>
                      <p style={{ fontSize: "0.8125rem", color: "var(--amber-800)", margin: "0.25rem 0 0", lineHeight: 1.5 }}>
                        In this phase, all assessments use authentic text analysis. Voice capture, acoustic telemetry, and pronunciation analysis will be introduced in a future update. No audio properties are fabricated. Please switch to Text Practice to draft and evaluate your response.
                      </p>
                    </div>
                  </div>
                )}

                {/* Text Practice Input Card */}
                {practiceMode === "text" && (
                  <Card style={{ padding: "1.75rem", marginBottom: "1.5rem" }}>
                    <div className="flex justify-between items-center" style={{ marginBottom: "0.5rem" }}>
                      <label className="form-label form-label-required" style={{ margin: 0 }}>
                        Your Draft Response
                      </label>
                      <span style={{ fontSize: "0.75rem", color: "var(--navy-500)" }}>
                        Focus on clarity, strong action verbs, and structured flow.
                      </span>
                    </div>

                    <textarea
                      className="form-input"
                      style={{
                        minHeight: "180px",
                        lineHeight: 1.6,
                        fontSize: "0.9375rem",
                        fontFamily: "inherit",
                        resize: "vertical",
                        marginBottom: "1rem"
                      }}
                      placeholder="Type your response here..."
                      value={userResponseText}
                      onChange={(e) => setUserResponseText(e.target.value)}
                    />

                    {/* Ground-Truth Text Telemetry Bar */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                        gap: "0.75rem",
                        background: "var(--navy-50)",
                        padding: "0.75rem 1rem",
                        borderRadius: "8px",
                        marginBottom: "1.5rem"
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "0.7rem", color: "var(--navy-500)", textTransform: "uppercase", fontWeight: 700 }}>
                          Word Count
                        </div>
                        <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--navy-900)" }}>
                          {currentMetrics.words}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: "0.7rem", color: "var(--navy-500)", textTransform: "uppercase", fontWeight: 700 }}>
                          Sentences
                        </div>
                        <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--navy-900)" }}>
                          {currentMetrics.sentences}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: "0.7rem", color: "var(--navy-500)", textTransform: "uppercase", fontWeight: 700 }}>
                          Delivery Est. (@130 wpm)
                        </div>
                        <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--navy-900)" }}>
                          {currentMetrics.deliverySec}s
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: "0.7rem", color: "var(--navy-500)", textTransform: "uppercase", fontWeight: 700 }}>
                          Vocab Diversity
                        </div>
                        <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--navy-900)" }}>
                          {currentMetrics.vocabPct}%
                        </div>
                      </div>
                    </div>

                    {/* Error Display */}
                    {evaluationError && (
                      <div style={{ background: "var(--rose-50)", border: "1px solid var(--rose-200)", padding: "1rem", borderRadius: "8px", marginBottom: "1.25rem", color: "var(--rose-700)" }}>
                        <div className="flex items-center gap-2" style={{ fontWeight: 700, marginBottom: "0.25rem" }}>
                          <AlertCircle size={16} />
                          <span>Evaluation Service Notice</span>
                        </div>
                        <p style={{ fontSize: "0.8125rem", margin: 0 }}>{evaluationError}</p>
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex justify-between items-center" style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "1rem" }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isEvaluating}
                        onClick={() => setUserResponseText("")}
                      >
                        <span>Clear</span>
                      </Button>

                      <Button
                        variant="primary"
                        size="lg"
                        loading={isEvaluating}
                        onClick={() => handleSubmitResponse(true)}
                      >
                        <Sparkles size={16} />
                        <span>Assess Communication & Save</span>
                      </Button>
                    </div>
                  </Card>
                )}

                {/* Feedback Card (Shown after evaluation) */}
                {evaluationResult && (
                  <Card style={{ padding: "2rem", marginBottom: "2rem", border: "2px solid var(--indigo-200)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                      <div>
                        <span className="demo-badge-pill" style={{ background: "var(--indigo-600)", color: "#ffffff", marginBottom: "0.35rem", display: "inline-block" }}>
                          Evaluated by {evaluationResult.evaluationSource || "AI Coach"}
                        </span>
                        <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--navy-900)", margin: 0 }}>
                          Communication Assessment
                        </h3>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "2.25rem", fontWeight: 900, color: "var(--indigo-600)", lineHeight: 1 }}>
                          {evaluationResult.score}
                          <span style={{ fontSize: "1rem", color: "var(--navy-400)" }}>/100</span>
                        </div>
                      </div>
                    </div>

                    {/* 5-Category Score Meters */}
                    {evaluationResult.scores && (
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                          gap: "0.75rem",
                          background: "var(--navy-50)",
                          padding: "1rem",
                          borderRadius: "10px",
                          marginBottom: "1.75rem"
                        }}
                      >
                        {[
                          { label: "Grammar", val: evaluationResult.scores.grammar },
                          { label: "Clarity", val: evaluationResult.scores.clarity },
                          { label: "Vocabulary", val: evaluationResult.scores.vocabulary },
                          { label: "Professional Tone", val: evaluationResult.scores.tone },
                          { label: "Conciseness", val: evaluationResult.scores.conciseness }
                        ].map((s, idx) => (
                          <div key={idx} style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "0.75rem", color: "var(--navy-600)", fontWeight: 600, marginBottom: "0.2rem" }}>
                              {s.label}
                            </div>
                            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--navy-900)" }}>
                              {s.val || 75}%
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Encouragement Banner */}
                    {evaluationResult.encouragement && (
                      <div
                        style={{
                          background: "var(--indigo-50)",
                          borderLeft: "4px solid var(--indigo-600)",
                          padding: "0.875rem 1.25rem",
                          borderRadius: "4px",
                          fontSize: "0.9375rem",
                          fontStyle: "italic",
                          color: "var(--indigo-950)",
                          marginBottom: "1.5rem"
                        }}
                      >
                        "{evaluationResult.encouragement}"
                      </div>
                    )}

                    {/* Strengths */}
                    <div style={{ marginBottom: "1.25rem" }}>
                      <div className="flex items-center gap-2" style={{ fontWeight: 700, color: "var(--emerald-700)", marginBottom: "0.35rem" }}>
                        <CheckCircle2 size={18} />
                        <span>Highlighted Strengths</span>
                      </div>
                      <div style={{ fontSize: "0.875rem", color: "var(--navy-800)", lineHeight: 1.6, paddingLeft: "1.6rem" }}>
                        {evaluationResult.strengths}
                      </div>
                    </div>

                    {/* Specific Improvement Areas */}
                    <div style={{ marginBottom: "1.5rem" }}>
                      <div className="flex items-center gap-2" style={{ fontWeight: 700, color: "var(--amber-700)", marginBottom: "0.35rem" }}>
                        <AlertTriangle size={18} />
                        <span>Specific Improvement Areas</span>
                      </div>
                      <div style={{ fontSize: "0.875rem", color: "var(--navy-800)", lineHeight: 1.6, paddingLeft: "1.6rem" }}>
                        {evaluationResult.improvements}
                      </div>
                    </div>

                    {/* Revised Model Version & Rationale */}
                    {evaluationResult.revisedVersion && (
                      <div style={{ background: "var(--navy-50)", border: "1px solid var(--border-subtle)", borderRadius: "8px", padding: "1.25rem", marginBottom: "1.5rem" }}>
                        <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--navy-800)", marginBottom: "0.4rem" }}>
                          Polished & Revised Version
                        </div>
                        <div style={{ fontSize: "0.9375rem", color: "var(--navy-950)", lineHeight: 1.6, fontStyle: "italic", marginBottom: "0.75rem" }}>
                          "{evaluationResult.revisedVersion}"
                        </div>
                        {evaluationResult.revisionRationale && (
                          <div style={{ fontSize: "0.8125rem", color: "var(--indigo-900)", borderTop: "1px solid var(--border-subtle)", paddingTop: "0.5rem" }}>
                            <strong>Why this is better:</strong> {evaluationResult.revisionRationale}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Follow-up exercise */}
                    {evaluationResult.followUpExercise && (
                      <div style={{ background: "var(--amber-50)", border: "1px solid var(--amber-200)", padding: "1rem", borderRadius: "8px", marginBottom: "1.75rem" }}>
                        <div className="flex items-center gap-2" style={{ fontWeight: 700, color: "var(--amber-900)", marginBottom: "0.25rem", fontSize: "0.8125rem" }}>
                          <Lightbulb size={16} />
                          <span>Follow-Up Practice Micro-Exercise</span>
                        </div>
                        <div style={{ fontSize: "0.8125rem", color: "var(--amber-950)", lineHeight: 1.5 }}>
                          {evaluationResult.followUpExercise}
                        </div>
                      </div>
                    )}

                    {/* Retry Button */}
                    <div className="flex justify-end gap-3" style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "1.25rem" }}>
                      <Button variant="outline" onClick={handleRetryActivity}>
                        <RotateCcw size={16} />
                        <span>Retry & Refine This Activity</span>
                      </Button>
                    </div>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        /* Progress & History Screen */
        <div>
          {/* Stats Summary Row */}
          {statsData && statsData.stats && (
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
                  <span className="stat-label">Total Practice Submissions</span>
                  <div className="stat-icon-wrapper" style={{ background: "var(--indigo-50)", color: "var(--indigo-600)" }}>
                    <MessageSquare size={18} />
                  </div>
                </div>
                <div className="stat-value">{statsData.stats.totalAttempts}</div>
                <div className="stat-trend stat-trend-up">
                  <CheckCircle2 size={14} />
                  <span>{statsData.stats.uniqueActivitiesCompleted} of 10 unique modules</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <span className="stat-label">Average Communication Score</span>
                  <div className="stat-icon-wrapper" style={{ background: "var(--emerald-50)", color: "var(--emerald-600)" }}>
                    <Award size={18} />
                  </div>
                </div>
                <div className="stat-value">{statsData.stats.averageScore || 0}%</div>
                <div className="stat-trend stat-trend-up">
                  <TrendingUp size={14} />
                  <span>Best Score: {statsData.stats.bestScore || 0}%</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <span className="stat-label">Avg Grammar Precision</span>
                  <div className="stat-icon-wrapper" style={{ background: "var(--blue-50)", color: "var(--blue-600)" }}>
                    <FileCheck2 size={18} />
                  </div>
                </div>
                <div className="stat-value">{statsData.stats.avgGrammar || 0}%</div>
                <div className="stat-trend">Syntactic Structure</div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <span className="stat-label">Avg Professional Tone</span>
                  <div className="stat-icon-wrapper" style={{ background: "var(--cyan-50)", color: "var(--cyan-600)" }}>
                    <ThumbsUp size={18} />
                  </div>
                </div>
                <div className="stat-value">{statsData.stats.avgTone || 0}%</div>
                <div className="stat-trend">Workplace Composure</div>
              </div>
            </div>
          )}

          {/* Submission History Feed */}
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--navy-900)", marginBottom: "1rem" }}>
            Submission History & Progression
          </h3>

          {loadingHistory ? (
            <Card style={{ padding: "2rem", textAlign: "center" }}>Loading your practice history...</Card>
          ) : historyList.length === 0 ? (
            <Card style={{ padding: "3rem", textAlign: "center" }}>
              <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--navy-800)", marginBottom: "0.5rem" }}>
                No completed communication activities yet
              </div>
              <p style={{ color: "var(--navy-500)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
                Select any of the 10 modules and submit your first draft to start tracking your progress.
              </p>
              <Button variant="primary" onClick={() => setHistoryTabOpen(false)}>
                <span>Start Practice</span>
              </Button>
            </Card>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {historyList.map((item) => (
                <Card key={item.id} style={{ padding: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                    <div>
                      <div className="flex items-center gap-2" style={{ marginBottom: "0.25rem" }}>
                        <Badge variant="indigo">{item.activity_title}</Badge>
                        <span style={{ fontSize: "0.75rem", color: "var(--navy-400)" }}>
                          {item.created_at ? new Date(item.created_at).toLocaleDateString() : "Recent"}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.9375rem", color: "var(--navy-900)", fontWeight: 600 }}>
                        "{item.user_response.slice(0, 120)}..."
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <span
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: 800,
                          color: "var(--indigo-600)"
                        }}
                      >
                        {item.score}/100
                      </span>
                    </div>
                  </div>

                  {item.strengths && (
                    <div style={{ fontSize: "0.8125rem", color: "var(--emerald-800)", marginBottom: "0.35rem" }}>
                      ✓ <strong>Strength:</strong> {item.strengths}
                    </div>
                  )}

                  {item.improvements && (
                    <div style={{ fontSize: "0.8125rem", color: "var(--amber-800)" }}>
                      ⚠ <strong>Focus Area:</strong> {item.improvements}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
