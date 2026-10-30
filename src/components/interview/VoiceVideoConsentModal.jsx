import React from "react";
import { ShieldCheck, Video, Mic, EyeOff, AlertTriangle, ArrowRight, X } from "lucide-react";
import { Button } from "../common/Button";

export const VoiceVideoConsentModal = ({ isOpen, onClose, onConsent, onDeclineTextMode, mode = "video" }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(15, 23, 42, 0.75)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "1rem"
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          maxWidth: "560px",
          width: "100%",
          padding: "2rem",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          border: "1px solid var(--border-subtle)"
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: "var(--indigo-50)",
              color: "var(--indigo-600)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {mode === "video" ? <Video size={24} /> : <Mic size={24} />}
          </div>
          <div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--navy-900)", margin: 0 }}>
              {mode === "video" ? "Camera & Microphone Access" : "Microphone Access"}
            </h2>
            <span style={{ fontSize: "0.8125rem", color: "var(--navy-500)" }}>
              CareerCoach AI • Privacy & Safety Standards
            </span>
          </div>
        </div>

        {/* Core Notice */}
        <p style={{ fontSize: "0.875rem", color: "var(--navy-700)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
          To simulate a real engineering campus placement interview, CareerCoach AI requires browser permission for your {mode === "video" ? "camera and microphone" : "microphone"}. Please review our privacy commitments below:
        </p>

        {/* Commitment Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.75rem",
              background: "var(--navy-50)",
              padding: "0.875rem",
              borderRadius: "8px",
              border: "1px solid var(--border-subtle)"
            }}
          >
            <ShieldCheck size={20} color="var(--emerald-600)" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--navy-900)" }}>
                100% Local Browser Stream — Zero Video/Audio Uploads
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--navy-600)", lineHeight: 1.5, marginTop: "2px" }}>
                Your media stream is processed entirely in your local browser window. Raw camera video and audio files are never recorded to disk, uploaded, or stored on remote servers.
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.75rem",
              background: "var(--navy-50)",
              padding: "0.875rem",
              borderRadius: "8px",
              border: "1px solid var(--border-subtle)"
            }}
          >
            <EyeOff size={20} color="var(--indigo-600)" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--navy-900)" }}>
                Strict Scientific Integrity — No Pseudoscience Facial Scoring
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--navy-600)", lineHeight: 1.5, marginTop: "2px" }}>
                We never claim to evaluate eye contact, emotions, confidence, stress, or personality from facial video. We evaluate only the substantive accuracy, structure, and clarity of your spoken or typed answers.
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.75rem",
              background: "var(--navy-50)",
              padding: "0.875rem",
              borderRadius: "8px",
              border: "1px solid var(--border-subtle)"
            }}
          >
            <AlertTriangle size={20} color="var(--amber-600)" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--navy-900)" }}>
                What Is Saved
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--navy-600)", lineHeight: 1.5, marginTop: "2px" }}>
                Only your transcribed text responses and the resulting AI rubric evaluations are saved to your student account for progress tracking.
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <Button
            variant="primary"
            size="lg"
            onClick={onConsent}
            style={{ width: "100%", justifyContent: "center" }}
          >
            <span>I Understand & Enable {mode === "video" ? "Camera & Mic" : "Microphone"}</span>
            <ArrowRight size={18} />
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={onDeclineTextMode}
            style={{ width: "100%", justifyContent: "center" }}
          >
            <span>Practice in Text-Only Mode Instead (No Hardware Required)</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
