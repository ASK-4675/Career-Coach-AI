import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Sidebar } from "../common/Sidebar";
import { Topbar } from "../common/Topbar";
import { Toast } from "../common/Toast";
import { Sparkles, Info, ShieldCheck } from "lucide-react";

export const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="app-main">
        {/* Phase 3 Backend & Database Banner */}
        <div className="demo-banner-top" style={{ background: "linear-gradient(90deg, #1e1b4b 0%, #312e81 100%)", borderBottom: "1px solid rgba(99, 102, 241, 0.3)" }}>
          <div className="flex items-center gap-2">
            <span className="demo-badge-pill" style={{ background: "#10b981", color: "#ffffff" }}>● Phase 3 Live Backend</span>
            <span style={{ color: "#e0e7ff" }}>
              <strong>Express.js & SQLite Connected:</strong> Session-based authentication, user-scoped data isolation & real DB persistence active.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span style={{ fontSize: "0.75rem", color: "#a5b4fc" }}>
              API: localhost:5000 (Session Active)
            </span>
          </div>
        </div>

        {/* Topbar */}
        <Topbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Dynamic Route Page View */}
        <main className="page-container">
          <Outlet />
        </main>
      </div>

      {/* Toast Notification Container */}
      <Toast />
    </div>
  );
};
