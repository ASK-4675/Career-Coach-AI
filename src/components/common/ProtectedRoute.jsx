import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, authLoading } = useApp();
  const location = useLocation();

  if (authLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--navy-950, #0a0f1d)",
          color: "#ffffff",
          gap: "1rem"
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "3px solid rgba(99, 102, 241, 0.2)",
            borderTopColor: "var(--indigo-500, #6366f1)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite"
          }}
        />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
        <div style={{ fontSize: "0.875rem", color: "var(--navy-400, #94a3b8)" }}>
          Verifying secure session...
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
