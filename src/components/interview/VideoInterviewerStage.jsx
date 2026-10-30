import React, { useState, useEffect, useRef } from "react";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Send,
  SkipForward,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Sliders,
  ShieldCheck,
  Bot,
  User,
  Radio,
  FileText
} from "lucide-react";
import { Button } from "../common/Button";
import { Badge } from "../common/Badge";
import { Card } from "../common/Card";
import { AudioVisualizerWave } from "./AudioVisualizerWave";

export const VideoInterviewerStage = ({
  session,
  currentQuestion,
  questionIndex,
  totalQuestions,
  interviewMode = "video", // 'video' | 'voice'
  feedbackMode = "immediate", // 'immediate' | 'end_of_interview'
  isSubmitting = false,
  aiError = null,
  onEvaluateAnswer, // (answerText, inputMode, allowFallback) => void
  onSaveAndAdvance, // (answerText, inputMode, isSkipped) => void
  onSkipQuestion,
  onEndInterview,
  onSwitchToTextMode,
  onFillDemoAnswer
}) => {
  // ── Media Stream State ──
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [streamActive, setStreamActive] = useState(false);
  const [mediaError, setMediaError] = useState(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(interviewMode === "voice");
  const [isMirrored, setIsMirrored] = useState(true);

  // ── Interviewer TTS State ──
  const [isTtsSpeaking, setIsTtsSpeaking] = useState(false);
  const [autoSpeakEnabled, setAutoSpeakEnabled] = useState(true);

  // ── Speech-To-Text (STT) State ──
  const [speechSupported, setSpeechSupported] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [studentAnswerText, setStudentAnswerText] = useState("");
  const [wasVoiceInputUsed, setWasVoiceInputUsed] = useState(false);
  const [wasManuallyEdited, setWasManuallyEdited] = useState(false);
  const [sttError, setSttError] = useState(null);
  const recognitionRef = useRef(null);

  // ── Interview Pause State ──
  const [isPaused, setIsPaused] = useState(false);

  // 1. Initialize Media (Camera & Mic)
  useEffect(() => {
    let isMounted = true;

    async function initMedia() {
      setMediaError(null);
      const wantsVideo = interviewMode === "video";

      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Your browser does not support mediaDevices API. Please use a modern browser or text mode.");
        }

        const constraints = {
          audio: true,
          video: wantsVideo
            ? {
                width: { ideal: 640 },
                height: { ideal: 480 },
                facingMode: "user"
              }
            : false
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (!isMounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        setStreamActive(true);

        if (videoRef.current && wantsVideo) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn("Media access failed:", err);
        if (!isMounted) return;

        let userMsg = "Could not access camera/microphone.";
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          userMsg = "Permission denied. Please grant camera/microphone permission in your browser address bar.";
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
          userMsg = "No camera or microphone hardware found on your system. You can practice seamlessly in text mode.";
        } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
          userMsg = "Camera/microphone is in use by another application (e.g. Zoom, Teams). Please close other apps or switch to text mode.";
        } else {
          userMsg = err.message || userMsg;
        }

        setMediaError(userMsg);
      }
    }

    initMedia();

    // Cleanup all media tracks on unmount
    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      }
      stopTts();
      stopStt();
    };
  }, [interviewMode]);

  // Window beforeunload safety cleanup
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      stopTts();
      stopStt();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // 2. Camera & Mic Toggles
  const handleToggleMic = () => {
    if (!streamRef.current) return;
    const audioTracks = streamRef.current.getAudioTracks();
    const nextMuted = !isMicMuted;
    audioTracks.forEach((track) => {
      track.enabled = !nextMuted;
    });
    setIsMicMuted(nextMuted);

    if (nextMuted && isListening) {
      stopStt();
    }
  };

  const handleToggleCamera = () => {
    if (!streamRef.current) return;
    const videoTracks = streamRef.current.getVideoTracks();
    const nextOff = !isCameraOff;
    videoTracks.forEach((track) => {
      track.enabled = !nextOff;
    });
    setIsCameraOff(nextOff);
  };

  // 3. Text-to-Speech (TTS) for Interviewer
  const speakQuestion = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Pick a natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(
      (v) => v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Samantha") || v.name.includes("David"))
    ) || voices.find((v) => v.lang.startsWith("en"));
    if (englishVoice) utterance.voice = englishVoice;

    utterance.onstart = () => setIsTtsSpeaking(true);
    utterance.onend = () => setIsTtsSpeaking(false);
    utterance.onerror = () => setIsTtsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopTts = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsTtsSpeaking(false);
  };

  // Auto-speak question when question changes
  useEffect(() => {
    if (currentQuestion?.question_text && autoSpeakEnabled && !isPaused) {
      // Delay slightly for smooth page render
      const timer = setTimeout(() => {
        speakQuestion(currentQuestion.question_text);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentQuestion?.id, autoSpeakEnabled, isPaused]);

  // Reset student answer and transcripts on question change
  useEffect(() => {
    setStudentAnswerText("");
    setInterimTranscript("");
    setWasVoiceInputUsed(false);
    setWasManuallyEdited(false);
    setSttError(null);
  }, [currentQuestion?.id]);

  // 4. Speech-to-Text (STT) Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        setSttError(null);
      };

      recognition.onresult = (event) => {
        let interim = "";
        let finalChunk = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalChunk += transcript + " ";
          } else {
            interim += transcript;
          }
        }

        if (finalChunk) {
          setWasVoiceInputUsed(true);
          setStudentAnswerText((prev) => {
            const trimmed = prev.trim();
            return trimmed ? `${trimmed} ${finalChunk.trim()}` : finalChunk.trim();
          });
        }
        setInterimTranscript(interim);
      };

      recognition.onerror = (event) => {
        console.warn("STT Error:", event.error);
        if (event.error === "no-speech") {
          setSttError("No speech detected. Please speak clearly or close to your microphone.");
        } else if (event.error === "audio-capture") {
          setSttError("Microphone capture issue. Check that your microphone is connected and unmuted.");
        } else if (event.error === "not-allowed") {
          setSttError("Microphone permission denied for speech recognition.");
        } else if (event.error === "network") {
          setSttError("Speech recognition network error. You can continue typing manually.");
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript("");
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.warn("Could not setup SpeechRecognition:", e);
      setSpeechSupported(false);
    }
  }, []);

  const startStt = () => {
    if (isMicMuted) {
      handleToggleMic();
    }
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn("Recognition start error:", err);
      }
    }
  };

  const stopStt = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn("Recognition stop error:", err);
      }
    }
    setIsListening(false);
    setInterimTranscript("");
  };

  const toggleListening = () => {
    if (isListening) {
      stopStt();
    } else {
      startStt();
    }
  };

  // 5. Pause & Resume Interview
  const handleTogglePause = () => {
    const nextPaused = !isPaused;
    setIsPaused(nextPaused);
    if (nextPaused) {
      stopTts();
      stopStt();
    }
  };

  // Determine input mode for telemetry
  const getInputMode = () => {
    if (wasVoiceInputUsed && wasManuallyEdited) return "voice_edited";
    if (wasVoiceInputUsed) return "voice";
    return "text";
  };

  // Handle student answer text change
  const handleTextChange = (e) => {
    setStudentAnswerText(e.target.value);
    if (wasVoiceInputUsed) {
      setWasManuallyEdited(true);
    }
  };

  const handleFillDemo = () => {
    if (onFillDemoAnswer) {
      onFillDemoAnswer();
    } else if (currentQuestion?.reference_answer) {
      setStudentAnswerText(currentQuestion.reference_answer);
    } else {
      setStudentAnswerText(
        "I approach this by structuring the problem, evaluating trade-offs, and verifying performance benchmarks."
      );
    }
    setWasManuallyEdited(true);
  };

  return (
    <div style={{ maxWidth: "1080px", margin: "0 auto", paddingBottom: "2rem" }}>
      {/* ── Progress & Status Header ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
          background: "var(--navy-900)",
          color: "#ffffff",
          padding: "0.75rem 1.25rem",
          borderRadius: "12px"
        }}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Radio size={16} color="var(--rose-400)" className="pulse-icon" />
            <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#ffffff" }}>
              Live Mock Interview #{session?.id}
            </span>
          </div>
          <span style={{ fontSize: "0.75rem", background: "rgba(255,255,255,0.15)", padding: "2px 8px", borderRadius: "999px" }}>
            {interviewMode === "video" ? "Video & Voice Mode" : "Voice-Only Mode"}
          </span>
          <span style={{ fontSize: "0.75rem", background: "rgba(99, 102, 241, 0.3)", padding: "2px 8px", borderRadius: "999px" }}>
            {feedbackMode === "immediate" ? "Immediate Feedback" : "Continuous Mock"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--navy-200)" }}>
            Question {questionIndex + 1} of {totalQuestions}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={handleTogglePause}
            style={{
              borderColor: "rgba(255,255,255,0.3)",
              color: "#ffffff",
              padding: "0.25rem 0.65rem",
              fontSize: "0.75rem"
            }}
          >
            {isPaused ? <Play size={14} /> : <Pause size={14} />}
            <span>{isPaused ? "Resume" : "Pause"}</span>
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={onEndInterview}
            style={{ padding: "0.25rem 0.65rem", fontSize: "0.75rem" }}
          >
            End Interview
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          width: "100%",
          height: "4px",
          background: "var(--navy-200)",
          borderRadius: "999px",
          overflow: "hidden",
          marginBottom: "1.25rem"
        }}
      >
        <div
          style={{
            width: `${((questionIndex + 1) / totalQuestions) * 100}%`,
            height: "100%",
            background: "var(--indigo-600)",
            transition: "width 0.3s ease"
          }}
        />
      </div>

      {/* Paused Overlay Alert */}
      {isPaused && (
        <div
          style={{
            background: "var(--amber-50)",
            border: "1px solid var(--amber-300)",
            borderRadius: "12px",
            padding: "1rem 1.5rem",
            marginBottom: "1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div className="flex items-center gap-3">
            <Pause size={24} color="var(--amber-700)" />
            <div>
              <div style={{ fontWeight: 700, color: "var(--amber-900)" }}>
                Interview Paused
              </div>
              <div style={{ fontSize: "0.8125rem", color: "var(--amber-800)" }}>
                Audio playback and speech recognition are paused. Take a breath and resume when ready.
              </div>
            </div>
          </div>
          <Button size="sm" variant="primary" onClick={handleTogglePause}>
            <Play size={14} />
            <span>Resume Interview</span>
          </Button>
        </div>
      )}

      {/* Hardware Error Alert (if camera/mic blocked or missing) */}
      {mediaError && (
        <div
          style={{
            background: "var(--rose-50)",
            border: "1px solid var(--rose-200)",
            borderRadius: "12px",
            padding: "1rem 1.5rem",
            marginBottom: "1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div className="flex items-center gap-3">
            <AlertCircle size={24} color="var(--rose-600)" />
            <div>
              <div style={{ fontWeight: 700, color: "var(--rose-900)" }}>
                Camera or Microphone Unavailable
              </div>
              <div style={{ fontSize: "0.8125rem", color: "var(--rose-800)" }}>
                {mediaError}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw size={14} />
              <span>Retry</span>
            </Button>
            <Button size="sm" variant="primary" onClick={onSwitchToTextMode}>
              <span>Switch to Text Fallback</span>
            </Button>
          </div>
        </div>
      )}

      {/* ── Main Dual Stage: AI Interviewer (Left) + Candidate Video (Right) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ marginBottom: "1.5rem" }}>
        {/* 1. AI Interviewer Card */}
        <Card
          style={{
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: "linear-gradient(180deg, #ffffff 0%, var(--navy-50) 100%)",
            border: "1px solid var(--border-subtle)",
            minHeight: "340px"
          }}
        >
          <div>
            {/* Interviewer Persona Top Bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div className="flex items-center gap-2">
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "var(--indigo-600)",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Bot size={20} />
                </div>
                <div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--navy-900)" }}>
                    AI Placement Interviewer
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--navy-500)" }}>
                    Synthesized Voice & Dynamic Wave
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="indigo">{currentQuestion?.category || "Technical"}</Badge>
                <Badge variant={currentQuestion?.difficulty === "hard" ? "rose" : currentQuestion?.difficulty === "easy" ? "emerald" : "amber"}>
                  {currentQuestion?.difficulty?.toUpperCase() || "MEDIUM"}
                </Badge>
              </div>
            </div>

            {/* Question Text */}
            <div style={{ marginBottom: "1.25rem" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--indigo-600)", textTransform: "uppercase", marginBottom: "0.35rem" }}>
                Current Question
              </div>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--navy-900)", lineHeight: 1.5, margin: 0 }}>
                {currentQuestion?.question_text}
              </h2>
            </div>
          </div>

          {/* AI Sound Wave & Audio Controls */}
          <div>
            <div
              style={{
                background: "rgba(99, 102, 241, 0.06)",
                borderRadius: "8px",
                padding: "0.75rem",
                border: "1px solid rgba(99, 102, 241, 0.15)",
                marginBottom: "0.75rem"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--indigo-900)" }}>
                  {isTtsSpeaking ? "🗣️ Interviewer is speaking question..." : "Waiting for candidate response"}
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--navy-500)" }}>
                  Web Speech Synthesis
                </span>
              </div>
              <AudioVisualizerWave
                isActive={isTtsSpeaking}
                isSpeaking={isTtsSpeaking}
                colorScheme="indigo"
              />
            </div>

            {/* TTS Action Bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Button
                size="sm"
                variant="outline"
                onClick={() => speakQuestion(currentQuestion?.question_text)}
                disabled={isPaused}
              >
                <Volume2 size={14} />
                <span>{isTtsSpeaking ? "Replay Question" : "Speak Question"}</span>
              </Button>

              <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", color: "var(--navy-600)", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={autoSpeakEnabled}
                  onChange={(e) => setAutoSpeakEnabled(e.target.checked)}
                />
                <span>Auto-read questions</span>
              </label>
            </div>
          </div>
        </Card>

        {/* 2. Candidate Webcam Feed & Controls Card */}
        <Card
          style={{
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: "#0f172a",
            color: "#ffffff",
            borderRadius: "12px",
            minHeight: "340px",
            position: "relative",
            overflow: "hidden"
          }}
        >
          {/* Video Preview Box */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "240px",
              background: "#020617",
              borderRadius: "8px",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {interviewMode === "video" && !isCameraOff ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: isMirrored ? "scaleX(-1)" : "none"
                }}
              />
            ) : (
              <div style={{ textAlign: "center", padding: "1.5rem" }}>
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.1)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "0.75rem"
                  }}
                >
                  <User size={32} color="rgba(255,255,255,0.7)" />
                </div>
                <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>
                  {interviewMode === "voice" ? "Voice-Only Mode Active" : "Camera Disabled"}
                </div>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", marginTop: "2px" }}>
                  {interviewMode === "voice" ? "Microphone input active" : "Audio remains active"}
                </div>
              </div>
            )}

            {/* Candidate Name Badge Overlay */}
            <div
              style={{
                position: "absolute",
                bottom: "8px",
                left: "8px",
                background: "rgba(15, 23, 42, 0.8)",
                padding: "2px 8px",
                borderRadius: "4px",
                fontSize: "0.75rem",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: isMicMuted ? "#ef4444" : "#10b981" }} />
              <span>You (Candidate)</span>
            </div>

            {/* Privacy Disclaimed Badge */}
            <div
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                background: "rgba(15, 23, 42, 0.75)",
                padding: "2px 8px",
                borderRadius: "4px",
                fontSize: "0.6875rem",
                color: "#94a3b8",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              <ShieldCheck size={12} color="#10b981" />
              <span>Local Stream Only</span>
            </div>
          </div>

          {/* Candidate Media Control Toolbar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "0.75rem",
              padding: "0 0.25rem"
            }}
          >
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleToggleMic}
                style={{
                  background: isMicMuted ? "rgba(239, 68, 68, 0.2)" : "rgba(255, 255, 255, 0.15)",
                  border: isMicMuted ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.2)",
                  color: isMicMuted ? "#fca5a5" : "#ffffff",
                  borderRadius: "8px",
                  padding: "0.45rem 0.75rem",
                  fontSize: "0.8125rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                {isMicMuted ? <MicOff size={16} /> : <Mic size={16} />}
                <span>{isMicMuted ? "Unmute Mic" : "Mute Mic"}</span>
              </button>

              {interviewMode === "video" && (
                <button
                  type="button"
                  onClick={handleToggleCamera}
                  style={{
                    background: isCameraOff ? "rgba(239, 68, 68, 0.2)" : "rgba(255, 255, 255, 0.15)",
                    border: isCameraOff ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.2)",
                    color: isCameraOff ? "#fca5a5" : "#ffffff",
                    borderRadius: "8px",
                    padding: "0.45rem 0.75rem",
                    fontSize: "0.8125rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  {isCameraOff ? <VideoOff size={16} /> : <Video size={16} />}
                  <span>{isCameraOff ? "Turn Cam On" : "Turn Cam Off"}</span>
                </button>
              )}
            </div>

            {interviewMode === "video" && !isCameraOff && (
              <button
                type="button"
                onClick={() => setIsMirrored(!isMirrored)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94a3b8",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  textDecoration: "underline"
                }}
              >
                {isMirrored ? "Unmirror View" : "Mirror View"}
              </button>
            )}
          </div>
        </Card>
      </div>

      {/* ── Candidate Speech Recognition & Editable Answer Area ── */}
      <Card style={{ padding: "1.75rem", marginBottom: "1.5rem" }}>
        {/* Voice Input Status Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            background: isListening ? "rgba(16, 185, 129, 0.1)" : "var(--navy-50)",
            border: isListening ? "1px solid var(--emerald-400)" : "1px solid var(--border-subtle)",
            marginBottom: "1rem"
          }}
        >
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant={isListening ? "danger" : "primary"}
              onClick={toggleListening}
              disabled={isPaused || !speechSupported}
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              <span>{isListening ? "Stop Speaking" : "Start Voice Answer"}</span>
            </Button>

            <div>
              <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: isListening ? "var(--emerald-800)" : "var(--navy-800)" }}>
                {isListening
                  ? "🎙️ Microphone is Listening... Speak your answer aloud"
                  : speechSupported
                  ? "Voice recognition ready. Click 'Start Voice Answer' or type directly."
                  : "Speech recognition not supported in this browser. Please type below."}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--navy-500)" }}>
                Speech is transcribed in real-time. You can manually edit or refine the text anytime before submitting.
              </div>
            </div>
          </div>

          <div style={{ width: "160px" }}>
            <AudioVisualizerWave
              isActive={isListening}
              isListening={isListening}
              colorScheme="emerald"
            />
          </div>
        </div>

        {/* Browser limitation notice if SpeechRecognition is not supported */}
        {!speechSupported && (
          <div
            style={{
              background: "var(--amber-50)",
              border: "1px solid var(--amber-200)",
              borderRadius: "8px",
              padding: "0.75rem 1rem",
              fontSize: "0.8125rem",
              color: "var(--amber-900)",
              marginBottom: "1rem"
            }}
          >
            <strong>Note on Browser Support:</strong> Web Speech recognition is natively supported in Google Chrome and Microsoft Edge. In other browsers, you can practice speaking aloud while reviewing your camera and typing your answer in the box below.
          </div>
        )}

        {/* STT Error Alert */}
        {sttError && (
          <div
            style={{
              background: "var(--amber-50)",
              border: "1px solid var(--amber-200)",
              borderRadius: "8px",
              padding: "0.65rem 1rem",
              fontSize: "0.8125rem",
              color: "var(--amber-900)",
              marginBottom: "1rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <span>{sttError}</span>
            <button
              onClick={() => setSttError(null)}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.75rem", textDecoration: "underline" }}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Editable Transcript Area */}
        <div className="form-group" style={{ marginBottom: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
            <label className="form-label form-label-required" style={{ margin: 0 }}>
              Your Answer Review & Editor
            </label>
            <div className="flex items-center gap-3">
              {wasVoiceInputUsed && (
                <span
                  style={{
                    fontSize: "0.75rem",
                    background: "var(--indigo-100)",
                    color: "var(--indigo-800)",
                    padding: "2px 8px",
                    borderRadius: "999px",
                    fontWeight: 600
                  }}
                >
                  {wasManuallyEdited ? "Voice Transcribed + Edited" : "Direct Voice Transcript"}
                </span>
              )}
              <span style={{ fontSize: "0.75rem", color: "var(--navy-400)" }}>
                {studentAnswerText.trim().split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
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
            placeholder="Your spoken words will appear here in real-time. You can pause, review, and manually edit the answer before submission..."
            value={studentAnswerText}
            onChange={handleTextChange}
          />

          {/* Interim speech ghost preview */}
          {interimTranscript && (
            <div
              style={{
                marginTop: "0.4rem",
                padding: "0.5rem 0.75rem",
                background: "var(--navy-50)",
                borderRadius: "6px",
                fontSize: "0.8125rem",
                color: "var(--navy-600)",
                fontStyle: "italic"
              }}
            >
              Transcribing: "{interimTranscript}..."
            </div>
          )}
        </div>

        {/* Quick Demo Helper */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <button
            type="button"
            onClick={handleFillDemo}
            style={{
              fontSize: "0.75rem",
              color: "var(--indigo-600)",
              fontWeight: 600,
              background: "none",
              border: "none",
              cursor: "pointer",
              textDecoration: "underline"
            }}
          >
            Pre-fill sample candidate response
          </button>

          {studentAnswerText && (
            <button
              type="button"
              onClick={() => {
                setStudentAnswerText("");
                setWasVoiceInputUsed(false);
                setWasManuallyEdited(false);
              }}
              style={{
                fontSize: "0.75rem",
                color: "var(--navy-400)",
                background: "none",
                border: "none",
                cursor: "pointer"
              }}
            >
              Clear answer
            </button>
          )}
        </div>

        {/* AI Error Alert if LLM failed */}
        {aiError && (
          <div
            style={{
              background: "var(--rose-50)",
              border: "1px solid var(--rose-200)",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1.5rem"
            }}
          >
            <div className="flex items-center gap-2" style={{ color: "var(--rose-700)", fontWeight: 700, marginBottom: "0.35rem" }}>
              <AlertCircle size={18} />
              <span>AI Evaluation Unavailable</span>
            </div>
            <p style={{ fontSize: "0.8125rem", color: "var(--rose-900)", margin: "0 0 0.75rem" }}>
              {aiError}
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="primary"
                onClick={() => onEvaluateAnswer(studentAnswerText, getInputMode(), false)}
              >
                <RefreshCw size={14} />
                <span>Retry AI Evaluation</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEvaluateAnswer(studentAnswerText, getInputMode(), true)}
              >
                <span>Evaluate with Local Rubric (Offline)</span>
              </Button>
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid var(--border-subtle)",
            paddingTop: "1.25rem"
          }}
        >
          <Button
            variant="outline"
            type="button"
            disabled={isSubmitting}
            onClick={onSkipQuestion}
          >
            <SkipForward size={16} />
            <span>Skip Question</span>
          </Button>

          <div className="flex gap-2">
            {feedbackMode === "immediate" ? (
              <Button
                variant="primary"
                size="lg"
                loading={isSubmitting}
                onClick={() => {
                  stopStt();
                  stopTts();
                  onEvaluateAnswer(studentAnswerText, getInputMode(), false);
                }}
              >
                <Send size={16} />
                <span>Submit for AI Evaluation</span>
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                loading={isSubmitting}
                onClick={() => {
                  stopStt();
                  stopTts();
                  onSaveAndAdvance(studentAnswerText, getInputMode(), false);
                }}
              >
                <Send size={16} />
                <span>
                  {questionIndex + 1 < totalQuestions
                    ? "Save Answer & Next Question"
                    : "Complete Mock & View Report"}
                </span>
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
