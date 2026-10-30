import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  LayoutDashboard,
  Bot,
  BookOpen,
  Mic,
  TrendingUp,
  Map,
  BarChart3,
  Layers,
  Briefcase,
  UserCheck,
  Settings,
  LogOut,
  X
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const Sidebar = ({ isOpen, onClose }) => {
  const { student, currentRole, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navSections = [
    {
      title: "Core Platform",
      items: [
        { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { path: "/interview-coach", label: "AI Interview Coach", icon: Bot, badge: "AI" },
        { path: "/question-bank", label: "Question Bank", icon: BookOpen },
        { path: "/communication-coach", label: "Communication Coach", icon: Mic, badge: "Voice" }
      ]
    },
    {
      title: "Analytics & Roadmaps",
      items: [
        { path: "/skill-gap", label: "Skill Gap Analysis", icon: TrendingUp },
        { path: "/roadmap", label: "Personalized Roadmap", icon: Map },
        { path: "/weekly-report", label: "Weekly Progress Report", icon: BarChart3 }
      ]
    },
    {
      title: "Placement Career Tracks",
      items: [
        { path: "/departments", label: "Departments", icon: Layers },
        { path: "/career-roles", label: "Career Roles", icon: Briefcase },
        { path: "/profile-setup", label: "Profile Setup Wizard", icon: UserCheck }
      ]
    },
    {
      title: "Account",
      items: [
        { path: "/settings", label: "Profile & Settings", icon: Settings }
      ]
    }
  ];

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? "active" : ""}`}
        onClick={onClose}
      />
      <aside className={`app-sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <Link to="/" className="brand-logo" onClick={onClose}>
            <div className="brand-icon">
              <Sparkles size={18} />
            </div>
            <span style={{ fontSize: "1.125rem" }}>CareerCoach</span>
            <span className="brand-badge">AI</span>
          </Link>
          <button
            className="btn-icon mobile-only"
            onClick={onClose}
            style={{
              display: isOpen ? "flex" : "none",
              color: "#94a3b8",
              borderColor: "rgba(255,255,255,0.1)",
              background: "transparent"
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="sidebar-content">
          {navSections.map((sec, idx) => (
            <div key={idx}>
              <div className="sidebar-section-title">{sec.title}</div>
              <ul className="sidebar-menu">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          `sidebar-link ${isActive ? "active" : ""}`
                        }
                        onClick={onClose}
                      >
                        <Icon size={18} />
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="sidebar-link-badge">
                            {item.badge}
                          </span>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="flex items-center justify-between">
            <Link
              to="/settings"
              className="user-mini-profile"
              onClick={onClose}
              style={{ textDecoration: "none" }}
            >
              <div className="user-avatar">{student.avatar}</div>
              <div className="user-info">
                <div className="user-name">{student.name}</div>
                <div className="user-role">{currentRole.title}</div>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="btn-icon"
              title="Log out"
              style={{
                color: "#94a3b8",
                borderColor: "rgba(255,255,255,0.1)",
                background: "transparent"
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
