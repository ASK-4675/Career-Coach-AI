import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  Bell,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  Sparkles,
  SlidersHorizontal,
  Bot
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const Topbar = ({ onToggleSidebar }) => {
  const {
    student,
    currentRole,
    notifications,
    markNotificationsAsRead,
    showToast
  } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      showToast(`Searching for "${searchQuery}" in question bank...`);
      navigate(`/question-bank?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="app-topbar">
      <div className="topbar-left">
        <button
          className="btn-icon mobile-only"
          onClick={onToggleSidebar}
          aria-label="Toggle menu"
          style={{ display: "flex" }}
        >
          <Menu size={20} />
        </button>

        <form onSubmit={handleSearchSubmit} className="search-box">
          <Search size={16} />
          <input
            type="text"
            className="form-input"
            placeholder="Search questions, topics, companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      <div className="topbar-right">
        <Link to="/career-roles" className="topbar-target-chip" title="Click to change target role">
          <span className="topbar-badge-dot" />
          <span>Role:</span>
          <strong>{currentRole.title}</strong>
        </Link>

        {/* Quick Launch Interview Button */}
        <Link to="/interview-coach">
          <button
            className="btn btn-primary btn-sm"
            style={{ padding: "0.45rem 0.85rem", fontSize: "0.8125rem" }}
          >
            <Bot size={15} />
            <span>Mock AI Session</span>
          </button>
        </Link>

        {/* Notification Bell */}
        <div style={{ position: "relative" }}>
          <button
            className="btn-icon"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            style={{ position: "relative" }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "4px",
                  right: "4px",
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#ef4444",
                  boxShadow: "0 0 0 2px #ffffff"
                }}
              />
            )}
          </button>

          {showNotifications && (
            <div
              style={{
                position: "absolute",
                top: "120%",
                right: 0,
                width: "320px",
                background: "#ffffff",
                borderRadius: "12px",
                boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.2)",
                border: "1px solid #e2e8f0",
                zIndex: 100,
                overflow: "hidden"
              }}
            >
              <div
                style={{
                  padding: "0.875rem 1rem",
                  borderBottom: "1px solid #e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <div style={{ fontWeight: 700, fontSize: "0.875rem" }}>
                  Notifications
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markNotificationsAsRead}
                    style={{
                      fontSize: "0.75rem",
                      color: "#4f46e5",
                      fontWeight: 600
                    }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div style={{ maxHeight: "280px", overflowY: "auto" }}>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      padding: "0.75rem 1rem",
                      borderBottom: "1px solid #f1f5f9",
                      background: n.unread ? "#f8fafc" : "#ffffff",
                      fontSize: "0.8125rem"
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 600,
                        color: "#0f172a",
                        marginBottom: "0.2rem"
                      }}
                    >
                      {n.title}
                    </div>
                    <div style={{ color: "#64748b", lineHeight: 1.4 }}>
                      {n.message}
                    </div>
                    <div
                      style={{
                        fontSize: "0.7rem",
                        color: "#94a3b8",
                        marginTop: "0.25rem"
                      }}
                    >
                      {n.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar linking to settings */}
        <Link to="/settings" title="Student Settings">
          <div
            className="user-avatar"
            style={{ width: "36px", height: "36px", fontSize: "0.8125rem", cursor: "pointer" }}
          >
            {student.avatar}
          </div>
        </Link>
      </div>
    </header>
  );
};
