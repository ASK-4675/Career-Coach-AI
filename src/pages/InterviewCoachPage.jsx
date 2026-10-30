import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  Bot,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Send,
  Award,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  FileText,
  SkipForward,
  Clock,
  RefreshCw,
  Sliders,
  Check,
  AlertTriangle,
  Video,
  Mic,
  ShieldCheck,
  Radio,
  EyeOff
} from "lucide-react";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { useApp } from "../context/AppContext";
import { interviewApi, questionBankApi } from "../services/api";
import { VoiceVideoConsentModal } from "../components/interview/VoiceVideoConsentModal";
import { VideoInterviewerStage } from "../components/interview/VideoInterviewerStage";

export const InterviewCoachPage = () => {
  const { currentRole, careerRoles, showToast, student } = useApp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Screen Phase: 'config' | 'active' | 'feedback' | 'report'
  const [phase, setPhase] = useState("config");

  // Configuration settings
  const [targetRoleId, setTargetRoleId] = useState(student.targetRoleId || currentRole.id || "full-stack-developer");
  const [interviewType, setInterviewType] = useState("mixed");
  const [difficulty, setDifficulty] = useState("medium");
  const [questionCount, setQuestionCount] = useState(3);
  const [interviewMode, setInterviewMode] = useState("video"); // 'video' | 'voice' | 'text'
  const [feedbackMode, setFeedbackMode] = useState("immediate"); // 'immediate' | 'end_of_interview'

  // Consent Modal State
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);

  // Active Session State
  const [currentSession, setCurrentSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Question Answer & Evaluation State
  const [studentAnswerText, setStudentAnswerText] = useState("");
  const [lastInputMode, setLastInputMode] = useState("text");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState(null);
  const [aiError, setAiError] = useState(null);
  const [finalReport, setFinalReport] = useState(null);

  // Handle direct questionId param from Question Bank
  useEffect(() => {
    const qId = searchParams.get("questionId");
    if (qId && phase === "config") {
      questionBankApi.getQuestion(qId).then((res) => {
        if (res.question) {
          setQuestions([res.question]);
          setInterviewType(res.question.interview_type || "technical");
          setDifficulty(res.question.difficulty || "medium");
        }
      }).catch((e) => console.warn("Could not load direct question:", e));
    }
  }, [searchParams, phase]);

  const currentQ = questions[currentIndex] || null;

  // 1. Handle Launch Button
  const handleLaunchClick = () => {
    if ((interviewMode === "video" || interviewMode === "voice") && !hasConsented) {
      setIsConsentModalOpen(true);
    } else {
      executeStartSession(interviewMode);
    }
  };

  const handleConsentApproved = () => {
    setHasConsented(true);
    setIsConsentModalOpen(false);
    executeStartSession(interviewMode);
  };

  const handleConsentDeclineTextMode = () => {
    setInterviewMode("text");
    setIsConsentModalOpen(false);
    executeStartSession("text");
  };

  // 2. Start Session in Backend
  const executeStartSession = async (modeToUse = interviewMode) => {
    setIsSubmitting(true);
    setAiError(null);
    try {
      const res = await interviewApi.startSession(
        targetRoleId,
        difficulty,
        interviewType,
        questionCount,
        modeToUse,
        feedbackMode
      );
      setCurrentSession(res.session);
      setQuestions(res.questions || []);
      setCurrentIndex(0);
      setStudentAnswerText("");
      setCurrentEvaluation(null);
      setPhase("active");
      showToast(
        modeToUse === "video"
          ? "Video & Voice Interview session started. Good luck!"
          : modeToUse === "voice"
          ? "Voice Interview session started. Good luck!"
          : "Text Interview session started. Good luck!"
      );
    } catch (err) {
      console.error("Start interview error:", err);
      showToast(err.message || "Failed to start interview session.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick fill sample answer for testing
  const handleFillDemoAnswer = () => {
    if (currentQ?.reference_answer) {
      setStudentAnswerText(currentQ.reference_answer);
      showToast("Loaded high-quality reference response!");
    } else {
      setStudentAnswerText(
        "I approach this by breaking down the core principles, analyzing the trade-offs, and ensuring robust edge-case handling."
      );
    }
  };

  // 3. Submit Answer for Evaluation (Used in Immediate Feedback Mode)
  const handleSubmitForEvaluation = async (answerText = studentAnswerText, inputMode = "text", allowFallback = false) => {
    if (!answerText.trim() && !allowFallback) {
      showToast("Please write or speak your answer before submitting.", "error");
      return;
    }

    setIsSubmitting(true);
    setAiError(null);
    setLastInputMode(inputMode);

    try {
      const res = await interviewApi.evaluateAnswer(currentSession.id, {
        question_id: currentQ?.id,
        question_text: currentQ?.question_text,
        category: currentQ?.category,
        interview_type: currentQ?.interview_type,
        difficulty: currentQ?.difficulty,
        student_answer: answerText,
        allow_fallback: allowFallback
      });

      setCurrentEvaluation(res.evaluation);
      setStudentAnswerText(answerText);
      setPhase("feedback");
      showToast("Answer evaluated by AI Coach!");
    } catch (err) {
      console.error("Evaluation error:", err);
      setAiError(err.message || "AI service is temporarily unavailable.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Retry Answer on current question
  const handleRetryCurrent = () => {
    setCurrentEvaluation(null);
    setAiError(null);
    setStudentAnswerText("");
    setPhase("active");
  };

  // 4. Commit Answer & Advance to next question (or complete)
  const handleCommitAndNext = async (answerText = studentAnswerText, inputMode = lastInputMode, isSkipped = false) => {
    setIsSubmitting(true);
    try {
      await interviewApi.saveAnswer(currentSession.id, {
        question_id: currentQ?.id,
        question_text: currentQ?.question_text,
        question_type: currentQ?.category,
        user_answer: isSkipped ? "[Question Skipped by Student]" : answerText,
        is_skipped: isSkipped,
        evaluation: isSkipped ? null : currentEvaluation,
        input_mode: inputMode
      });

      const nextIdx = currentIndex + 1;
      if (nextIdx < questions.length) {
        setCurrentIndex(nextIdx);
        setStudentAnswerText("");
        setCurrentEvaluation(null);
        setAiError(null);
        setPhase("active");
        showToast("Saved! Moving to next question.");
      } else {
        // Complete the session
        handleFinalizeSession();
      }
    } catch (err) {
      console.error("Save answer error:", err);
      showToast("Could not save answer. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Conclude and Show Report
  const handleFinalizeSession = async () => {
    setIsSubmitting(true);
    try {
      const res = await interviewApi.completeSession(currentSession.id, {});
      setFinalReport(res);
      setPhase("report");
      showToast("Interview completed! Generating final report...");
    } catch (err) {
      console.error("Complete session error:", err);
      showToast("Failed to finalize session.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper for score badge color
  const getScoreColor = (score) => {
    if (score >= 80) return "var(--emerald-600, #10b981)";
    if (score >= 60) return "var(--indigo-600, #6366f1)";
    if (score >= 40) return "var(--amber-600, #f59e0b)";
    return "var(--rose-600, #ef4444)";
  };

  return (
    <div style={{ maxWidth: "1080px", margin: "0 auto", paddingBottom: "3rem" }}>
      {/* Privacy & Consent Modal */}
      <VoiceVideoConsentModal
        isOpen={isConsentModalOpen}
        mode={interviewMode}
        onConsent={handleConsentApproved}
        onDeclineTextMode={handleConsentDeclineTextMode}
      />

      {/* ── PHASE 1: CONFIGURATION ─────────────────────────── */}
      {phase === "config" && (
        <div>
          <div className="page-header" style={{ marginBottom: "2rem" }}>
            <div className="page-header-text">
              <h1>
                <Bot size={28} color="var(--indigo-600)" />
                <span>AI Placement Interview Coach</span>
              </h1>
              <p>
                Practice technical, behavioral, and campus recruitment mock interviews via Voice, Video, or Text modes.
              </p>
            </div>
          </div>

          <Card style={{ padding: "2.25rem" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--navy-900)" }}>
              Configure Your Mock Interview
            </h3>
            <p style={{ fontSize: "0.875rem", color: "var(--navy-500)", marginBottom: "1.75rem" }}>
              Choose your practice format, question difficulty, and review mode for your target engineering placement.
            </p>

            {/* 1. Interview Mode Selector */}
            <div style={{ marginBottom: "1.75rem" }}>
              <label className="form-label form-label-required" style={{ marginBottom: "0.75rem" }}>
                Select Interview Mode
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setInterviewMode("video")}
                  style={{
                    textAlign: "left",
                    padding: "1rem",
                    borderRadius: "10px",
                    border: interviewMode === "video" ? "2px solid var(--indigo-600)" : "1px solid var(--border-subtle)",
                    background: interviewMode === "video" ? "var(--indigo-50)" : "#ffffff",
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                >
                  <div className="flex items-center gap-2" style={{ fontWeight: 700, color: "var(--navy-900)", marginBottom: "0.25rem" }}>
                    <Video size={18} color="var(--indigo-600)" />
                    <span>Video & Voice Mock</span>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--navy-600)", lineHeight: 1.4 }}>
                    Camera preview, live speech recognition, spoken AI questions, and real-time transcript editing.
                  </div>
                  <span style={{ display: "inline-block", marginTop: "0.5rem", fontSize: "0.6875rem", color: "var(--indigo-700)", fontWeight: 600 }}>
                    ★ Recommended for Placement Prep
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setInterviewMode("voice")}
                  style={{
                    textAlign: "left",
                    padding: "1rem",
                    borderRadius: "10px",
                    border: interviewMode === "voice" ? "2px solid var(--indigo-600)" : "1px solid var(--border-subtle)",
                    background: interviewMode === "voice" ? "var(--indigo-50)" : "#ffffff",
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                >
                  <div className="flex items-center gap-2" style={{ fontWeight: 700, color: "var(--navy-900)", marginBottom: "0.25rem" }}>
                    <Mic size={18} color="var(--indigo-600)" />
                    <span>Voice-Only Practice</span>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--navy-600)", lineHeight: 1.4 }}>
                    Speech-to-text with spoken AI questions, without activating your webcam video feed.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setInterviewMode("text")}
                  style={{
                    textAlign: "left",
                    padding: "1rem",
                    borderRadius: "10px",
                    border: interviewMode === "text" ? "2px solid var(--indigo-600)" : "1px solid var(--border-subtle)",
                    background: interviewMode === "text" ? "var(--indigo-50)" : "#ffffff",
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                >
                  <div className="flex items-center gap-2" style={{ fontWeight: 700, color: "var(--navy-900)", marginBottom: "0.25rem" }}>
                    <FileText size={18} color="var(--indigo-600)" />
                    <span>Text-Only Fallback</span>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--navy-600)", lineHeight: 1.4 }}>
                    Standard typed response format. Ideal for quiet study environments or unsupported browsers.
                  </div>
                </button>
              </div>
            </div>

            {/* 2. Feedback Mode Selector */}
            <div style={{ marginBottom: "1.75rem" }}>
              <label className="form-label form-label-required" style={{ marginBottom: "0.75rem" }}>
                Feedback & Review Mode
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFeedbackMode("immediate")}
                  style={{
                    textAlign: "left",
                    padding: "0.875rem 1rem",
                    borderRadius: "8px",
                    border: feedbackMode === "immediate" ? "2px solid var(--indigo-600)" : "1px solid var(--border-subtle)",
                    background: feedbackMode === "immediate" ? "var(--indigo-50)" : "#ffffff",
                    cursor: "pointer"
                  }}
                >
                  <div style={{ fontWeight: 700, color: "var(--navy-900)", fontSize: "0.875rem" }}>
                    ⚡ Immediate Review & Retry
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--navy-600)", marginTop: "2px" }}>
                    View AI score, strengths, and model answer immediately after each question with a retry option.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFeedbackMode("end_of_interview")}
                  style={{
                    textAlign: "left",
                    padding: "0.875rem 1rem",
                    borderRadius: "8px",
                    border: feedbackMode === "end_of_interview" ? "2px solid var(--indigo-600)" : "1px solid var(--border-subtle)",
                    background: feedbackMode === "end_of_interview" ? "var(--indigo-50)" : "#ffffff",
                    cursor: "pointer"
                  }}
                >
                  <div style={{ fontWeight: 700, color: "var(--navy-900)", fontSize: "0.875rem" }}>
                    🎯 Realistic Mock Panel (Continuous)
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--navy-600)", marginTop: "2px" }}>
                    Simulates a real interview flow without interruptions. Full evaluation report delivered at the end.
                  </div>
                </button>
              </div>
            </div>

            {/* 3. Role & Interview Type Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ marginBottom: "1.5rem" }}>
              <div className="form-group">
                <label className="form-label form-label-required">Target Career Role</label>
                <select
                  className="form-select"
                  value={targetRoleId}
                  onChange={(e) => setTargetRoleId(e.target.value)}
                >
                  {careerRoles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} ({r.category})
                    </option>
                  ))}
                </select>
                <span className="form-hint">Questions will calibrate to this role's core expectations.</span>
              </div>

              <div className="form-group">
                <label className="form-label form-label-required">Interview Format</label>
                <select
                  className="form-select"
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                >
                  <option value="mixed">Mixed (Technical + Behavioral + HR)</option>
                  <option value="technical">Technical Only (Algorithms, Systems, Engineering)</option>
                  <option value="behavioral">Behavioral (STAR Method, Teamwork, Leadership)</option>
                  <option value="hr">HR & Self-Introduction</option>
                  <option value="aptitude">Quantitative & Logical Aptitude</option>
                </select>
                <span className="form-hint">Mixed round simulates standard campus recruitment rounds.</span>
              </div>
            </div>

            {/* 4. Difficulty & Question Count */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ marginBottom: "1.75rem" }}>
              <div className="form-group">
                <label className="form-label form-label-required">Difficulty Level</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {[
                    { id: "easy", label: "Easy (Foundations)" },
                    { id: "medium", label: "Medium (Growth Tech)" },
                    { id: "hard", label: "Hard (Tier-1 Product)" }
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      className={`btn btn-sm ${difficulty === d.id ? "btn-primary" : "btn-outline"}`}
                      style={{ flex: 1, padding: "0.5rem" }}
                      onClick={() => setDifficulty(d.id)}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label form-label-required">Number of Questions</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {[2, 3, 5].map((count) => (
                    <button
                      key={count}
                      type="button"
                      className={`btn btn-sm ${questionCount === count ? "btn-secondary" : "btn-outline"}`}
                      style={{ flex: 1, padding: "0.5rem" }}
                      onClick={() => setQuestionCount(count)}
                    >
                      {count} Questions
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Privacy & Evaluation Standard Note */}
            <div style={{ background: "var(--indigo-50)", border: "1px solid var(--indigo-200)", padding: "1rem 1.25rem", borderRadius: "8px", marginBottom: "2rem" }}>
              <div className="flex items-center gap-2" style={{ fontWeight: 700, color: "var(--indigo-900)", marginBottom: "0.25rem" }}>
                <ShieldCheck size={16} />
                <span>Privacy & AI Evaluation Standards</span>
              </div>
              <p style={{ fontSize: "0.8125rem", color: "var(--indigo-950)", margin: 0, lineHeight: 1.5 }}>
                Video and audio streams are processed locally in your browser and never uploaded. We evaluate your substantive accuracy, structure, and communication clarity without making unscientific claims regarding facial expressions or eye contact.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="primary"
                size="lg"
                loading={isSubmitting}
                onClick={handleLaunchClick}
              >
                <span>Launch Mock Interview</span>
                <ArrowRight size={18} />
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ── PHASE 2: ACTIVE QUESTION SCREEN ───────────────── */}
      {phase === "active" && currentQ && (
        <div>
          {interviewMode === "video" || interviewMode === "voice" ? (
            /* 1. Voice and Video Interview Stage */
            <VideoInterviewerStage
              session={currentSession}
              currentQuestion={currentQ}
              questionIndex={currentIndex}
              totalQuestions={questions.length}
              interviewMode={interviewMode}
              feedbackMode={feedbackMode}
              isSubmitting={isSubmitting}
              aiError={aiError}
              onEvaluateAnswer={(ansText, inMode, allowFallback) =>
                handleSubmitForEvaluation(ansText, inMode, allowFallback)
              }
              onSaveAndAdvance={(ansText, inMode, isSkipped) =>
                handleCommitAndNext(ansText, inMode, isSkipped)
              }
              onSkipQuestion={() => handleCommitAndNext("[Skipped]", "text", true)}
              onEndInterview={() => handleFinalizeSession()}
              onSwitchToTextMode={() => {
                setInterviewMode("text");
                showToast("Switched to Text Interview Fallback.");
              }}
              onFillDemoAnswer={handleFillDemoAnswer}
            />
          ) : (
            /* 2. Text Interview Fallback Mode */
            <div>
              {/* Progress header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--indigo-600)" }}>
                    Question {currentIndex + 1} of {questions.length}
                  </span>
                  <span className="demo-badge-pill">Session #{currentSession?.id} • Text Mode</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="indigo">{currentQ.category}</Badge>
                  <Badge variant="blue">{currentQ.interview_type?.toUpperCase()}</Badge>
                  <Badge variant={currentQ.difficulty === "easy" ? "emerald" : currentQ.difficulty === "hard" ? "rose" : "amber"}>
                    {currentQ.difficulty?.toUpperCase()}
                  </Badge>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ width: "100%", height: "6px", background: "var(--navy-200)", borderRadius: "999px", overflow: "hidden", marginBottom: "1.75rem" }}>
                <div
                  style={{
                    width: `${((currentIndex + 1) / questions.length) * 100}%`,
                    height: "100%",
                    background: "var(--indigo-600)",
                    transition: "width 0.3s ease"
                  }}
                />
              </div>

              <Card style={{ padding: "2rem", marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--navy-400)", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                  Interviewer Prompt
                </div>
                <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--navy-900)", lineHeight: 1.5, marginBottom: "1.5rem" }}>
                  {currentQ.question_text}
                </h2>

                {/* Answer Input Area */}
                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <div className="flex justify-between items-center" style={{ marginBottom: "0.4rem" }}>
                    <label className="form-label form-label-required" style={{ margin: 0 }}>
                      Your Answer
                    </label>
                    <span style={{ fontSize: "0.75rem", color: "var(--navy-400)" }}>
                      {studentAnswerText.trim().split(/\s+/).filter(Boolean).length} words
                    </span>
                  </div>
                  <textarea
                    className="form-input"
                    style={{
                      minHeight: "180px",
                      lineHeight: 1.6,
                      fontSize: "0.9375rem",
                      fontFamily: "inherit",
                      resize: "vertical"
                    }}
                    placeholder="Type your structured answer here. Include relevant principles, formulas, or trade-offs..."
                    value={studentAnswerText}
                    onChange={(e) => setStudentAnswerText(e.target.value)}
                  />
                </div>

                {/* Helper action: Quick Fill Reference for testing */}
                <div className="flex justify-between items-center" style={{ marginBottom: "1.5rem" }}>
                  <button
                    type="button"
                    onClick={handleFillDemoAnswer}
                    style={{ fontSize: "0.75rem", color: "var(--indigo-600)", fontWeight: 600, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
                  >
                    Pre-fill sample candidate response
                  </button>

                  <button
                    type="button"
                    onClick={() => setInterviewMode("video")}
                    style={{ fontSize: "0.75rem", color: "var(--indigo-600)", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}
                  >
                    📹 Switch to Video/Voice Mode
                  </button>
                </div>

                {/* AI Error Alert if LLM failed */}
                {aiError && (
                  <div style={{ background: "var(--rose-50)", border: "1px solid var(--rose-200)", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem" }}>
                    <div className="flex items-center gap-2" style={{ color: "var(--rose-700)", fontWeight: 700, marginBottom: "0.35rem" }}>
                      <AlertCircle size={18} />
                      <span>AI Evaluation Unavailable</span>
                    </div>
                    <p style={{ fontSize: "0.8125rem", color: "var(--rose-900)", margin: "0 0 0.75rem" }}>
                      {aiError}
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="primary" onClick={() => handleSubmitForEvaluation(studentAnswerText, "text", false)}>
                        <RefreshCw size={14} />
                        <span>Retry AI Evaluation</span>
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleSubmitForEvaluation(studentAnswerText, "text", true)}>
                        <span>Evaluate with Local Rubric (Offline)</span>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Action Bar */}
                <div className="flex justify-between items-center" style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "1.25rem" }}>
                  <Button
                    variant="outline"
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleCommitAndNext("[Skipped]", "text", true)}
                  >
                    <SkipForward size={16} />
                    <span>Skip Question</span>
                  </Button>

                  {feedbackMode === "immediate" ? (
                    <Button
                      variant="primary"
                      size="lg"
                      loading={isSubmitting}
                      onClick={() => handleSubmitForEvaluation(studentAnswerText, "text", false)}
                    >
                      <Send size={16} />
                      <span>Submit for AI Evaluation</span>
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="lg"
                      loading={isSubmitting}
                      onClick={() => handleCommitAndNext(studentAnswerText, "text", false)}
                    >
                      <Send size={16} />
                      <span>
                        {currentIndex + 1 < questions.length
                          ? "Save Answer & Next Question"
                          : "Complete Interview & View Report"}
                      </span>
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* ── PHASE 3: EVALUATION & FEEDBACK VIEW (Immediate Mode) ── */}
      {phase === "feedback" && currentEvaluation && currentQ && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--navy-900)" }}>
              AI Coach Evaluation & Rubric Feedback
            </h2>
            <div className="flex items-center gap-2">
              <span
                style={{
                  fontSize: "0.75rem",
                  padding: "0.25rem 0.65rem",
                  borderRadius: "999px",
                  background: "var(--navy-100)",
                  color: "var(--navy-800)",
                  fontWeight: 600
                }}
              >
                Input Mode: {lastInputMode === "voice" ? "🎙️ Voice Transcribed" : lastInputMode === "voice_edited" ? "🎙️ Spoken + Edited" : "📝 Typed"}
              </span>
              <span
                style={{
                  fontSize: "0.75rem",
                  padding: "0.25rem 0.65rem",
                  borderRadius: "999px",
                  background: "var(--indigo-100)",
                  color: "var(--indigo-900)",
                  fontWeight: 600
                }}
              >
                Source: {currentEvaluation.evaluationSource || "AI Evaluator"}
              </span>
            </div>
          </div>

          <Card style={{ padding: "2rem", marginBottom: "1.5rem" }}>
            {/* Score & Verdict Banner */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "var(--navy-50)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "12px",
                padding: "1.25rem 1.5rem",
                marginBottom: "1.75rem"
              }}
            >
              <div>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--navy-500)", textTransform: "uppercase" }}>
                  Score & Verdict
                </div>
                <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--navy-900)", marginTop: "0.2rem" }}>
                  {currentEvaluation.verdict || "Evaluated"}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 900,
                    color: getScoreColor(currentEvaluation.score || 0),
                    lineHeight: 1
                  }}
                >
                  {currentEvaluation.score || 0}
                  <span style={{ fontSize: "1rem", color: "var(--navy-400)", fontWeight: 600 }}>/100</span>
                </div>
              </div>
            </div>

            {/* Encouragement Quote */}
            {currentEvaluation.encouragement && (
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
                "{currentEvaluation.encouragement}"
              </div>
            )}

            {/* What you did well */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div className="flex items-center gap-2" style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--emerald-700)", marginBottom: "0.4rem" }}>
                <CheckCircle2 size={18} />
                <span>What You Did Well</span>
              </div>
              <div style={{ fontSize: "0.875rem", color: "var(--navy-800)", lineHeight: 1.6, paddingLeft: "1.6rem" }}>
                {currentEvaluation.whatDidWell || "Addressed the prompt directly."}
              </div>
            </div>

            {/* Missing or incorrect points */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div className="flex items-center gap-2" style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--amber-700)", marginBottom: "0.4rem" }}>
                <AlertTriangle size={18} />
                <span>Missing or Incorrect Points</span>
              </div>
              <div style={{ fontSize: "0.875rem", color: "var(--navy-800)", lineHeight: 1.6, paddingLeft: "1.6rem" }}>
                {currentEvaluation.missingPoints || "None identified."}
              </div>
            </div>

            {/* Actionable Improvement Tip */}
            {currentEvaluation.improvementTip && (
              <div style={{ background: "var(--amber-50)", border: "1px solid var(--amber-200)", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--amber-900)", marginBottom: "0.25rem" }}>
                  💡 Actionable Improvement Tip
                </div>
                <div style={{ fontSize: "0.8125rem", color: "var(--amber-950)", lineHeight: 1.5 }}>
                  {currentEvaluation.improvementTip}
                </div>
              </div>
            )}

            {/* Suggested Improved Answer */}
            {currentEvaluation.suggestedAnswer && (
              <div style={{ background: "var(--navy-50)", border: "1px solid var(--border-subtle)", borderRadius: "8px", padding: "1.25rem", marginBottom: "2rem" }}>
                <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--navy-700)", marginBottom: "0.5rem" }}>
                  Suggested Improved Answer (Model Response)
                </div>
                <div style={{ fontSize: "0.875rem", color: "var(--navy-900)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                  {currentEvaluation.suggestedAnswer}
                </div>
              </div>
            )}

            {/* Actions: Retry vs Continue */}
            <div className="flex justify-between items-center" style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "1.25rem" }}>
              <Button
                variant="outline"
                onClick={handleRetryCurrent}
                disabled={isSubmitting}
              >
                <RotateCcw size={16} />
                <span>Retry This Answer</span>
              </Button>

              <Button
                variant="primary"
                size="lg"
                loading={isSubmitting}
                onClick={() => handleCommitAndNext(studentAnswerText, lastInputMode, false)}
              >
                <span>
                  {currentIndex + 1 < questions.length ? "Save & Next Question" : "Complete Interview & View Report"}
                </span>
                <ArrowRight size={16} />
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ── PHASE 4: FINAL SESSION REPORT VIEW ─────────────── */}
      {phase === "report" && finalReport && (
        <div>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ display: "inline-flex", padding: "0.8rem", borderRadius: "50%", background: "var(--indigo-50)", color: "var(--indigo-600)", marginBottom: "0.75rem" }}>
              <Award size={36} />
            </div>
            <h1 style={{ fontSize: "1.875rem", fontWeight: 800, color: "var(--navy-900)" }}>
              Mock Interview Performance Report
            </h1>
            <p style={{ color: "var(--navy-500)", fontSize: "0.9375rem" }}>
              Session #{finalReport.session?.id} completed • Evaluated against campus placement standards
            </p>
          </div>

          {/* Aggregate Score Card */}
          <Card style={{ padding: "2rem", textAlign: "center", marginBottom: "1.75rem" }}>
            <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--navy-500)", textTransform: "uppercase" }}>
              Overall Candidate Score
            </div>
            <div
              style={{
                fontSize: "3.5rem",
                fontWeight: 900,
                color: getScoreColor(finalReport.aggregateScore || 0),
                lineHeight: 1.1,
                margin: "0.5rem 0"
              }}
            >
              {finalReport.aggregateScore || 0}%
            </div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--navy-900)", marginBottom: "0.75rem" }}>
              {finalReport.summary}
            </div>
            <div className="flex justify-center gap-3">
              <Badge variant="indigo">Questions: {finalReport.answers?.length || 0}</Badge>
              <Badge variant="emerald">Target Role: {currentRole.title}</Badge>
              <Badge variant="blue">Mode: {finalReport.session?.interview_mode?.toUpperCase() || "MOCK"}</Badge>
            </div>
          </Card>

          {/* Question-by-Question Breakdown */}
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--navy-900)", marginBottom: "1rem" }}>
            Question-by-Question Review
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
            {(finalReport.answers || []).map((ans, idx) => (
              <Card key={ans.id || idx} style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <div style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--navy-900)", maxWidth: "75%" }}>
                    Q{idx + 1}: {ans.question_text}
                  </div>
                  <div className="flex items-center gap-2">
                    {ans.input_mode && (
                      <span style={{ fontSize: "0.7rem", background: "var(--navy-100)", color: "var(--navy-700)", padding: "2px 6px", borderRadius: "4px" }}>
                        {ans.input_mode === "voice" ? "🎙️ Voice" : ans.input_mode === "voice_edited" ? "🎙️ Spoken + Edited" : "📝 Typed"}
                      </span>
                    )}
                    <div style={{ fontSize: "1.125rem", fontWeight: 800, color: getScoreColor(ans.score || 0) }}>
                      {ans.score !== null ? `${ans.score}/100` : "Skipped"}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: "0.8125rem", color: "var(--navy-600)", background: "var(--navy-50)", padding: "0.75rem", borderRadius: "6px", marginBottom: "0.75rem" }}>
                  <strong>Your Answer:</strong> {ans.user_answer}
                </div>

                {ans.what_did_well && (
                  <div style={{ fontSize: "0.8125rem", color: "var(--emerald-800)", marginBottom: "0.35rem" }}>
                    ✓ <strong>Well Done:</strong> {ans.what_did_well}
                  </div>
                )}

                {ans.missing_points && (
                  <div style={{ fontSize: "0.8125rem", color: "var(--amber-800)", marginBottom: "0.35rem" }}>
                    ⚠ <strong>Improvement:</strong> {ans.missing_points}
                  </div>
                )}

                {ans.improvement_tip && (
                  <div style={{ fontSize: "0.75rem", color: "var(--navy-500)", fontStyle: "italic", marginTop: "0.5rem" }}>
                    Tip: {ans.improvement_tip}
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Navigation Actions */}
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => setPhase("config")}>
              <RotateCcw size={16} />
              <span>Start Another Mock Interview</span>
            </Button>
            <Button variant="primary" onClick={() => navigate("/question-bank")}>
              <BookOpen size={16} />
              <span>Practice in Question Bank</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
