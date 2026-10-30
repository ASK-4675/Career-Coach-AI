import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Sparkles, ArrowRight, LayoutDashboard, UserCheck } from "lucide-react";
import { Button } from "./Button";
import { useApp } from "../../context/AppContext";

export const Navbar = () => {
  const location = useLocation();
  const { isLoggedIn } = useApp();

  return (
    <header className="public-nav">
      <div className="container public-nav-inner">
        <Link to="/" className="brand-logo">
          <div className="brand-icon">
            <Sparkles size={20} />
          </div>
          <span>CareerCoach</span>
          <span className="brand-badge">AI</span>
        </Link>

        <nav className="public-nav-links">
          <Link to="/" className="public-nav-link">
            Overview
          </Link>
          <a href="/#features" className="public-nav-link">
            Features
          </a>
          <a href="/#how-it-works" className="public-nav-link">
            How It Works
          </a>
          <a href="/#curriculum" className="public-nav-link">
            Engineering Roles
          </a>
          <Link to="/question-bank" className="public-nav-link">
            Question Bank
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/dashboard">
            <Button variant="outline" size="sm" style={{ color: "#ffffff", borderColor: "rgba(255,255,255,0.2)" }}>
              <LayoutDashboard size={14} />
              <span>Live Demo</span>
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="ghost" size="sm" style={{ color: "#ffffff" }}>
              Log In
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="primary" size="sm">
              <span>Get Started Free</span>
              <ArrowRight size={14} />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
