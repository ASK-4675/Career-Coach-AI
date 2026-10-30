import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useApp } from "../../context/AppContext";

export const Toast = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const isSuccess = toast.type === "success";
  const isError = toast.type === "error";

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        background: isSuccess ? "#0f172a" : isError ? "#ef4444" : "#1e293b",
        color: "#ffffff",
        padding: "0.875rem 1.25rem",
        borderRadius: "10px",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        fontSize: "0.875rem",
        fontWeight: "500",
        animation: "slideUp 0.25s ease-out"
      }}
    >
      {isSuccess && <CheckCircle2 size={18} color="#10b981" />}
      {isError && <AlertCircle size={18} color="#fee2e2" />}
      {!isSuccess && !isError && <Info size={18} color="#818cf8" />}
      <span>{toast.message}</span>
    </div>
  );
};
