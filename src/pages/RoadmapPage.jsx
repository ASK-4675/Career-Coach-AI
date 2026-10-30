import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Map,
  CheckCircle2,
  Clock,
  ArrowRight,
  BookOpen,
  Bot,
  Sparkles,
  RotateCcw,
  ListFilter
} from "lucide-react";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { useApp } from "../context/AppContext";

export const RoadmapPage = () => {
  const { roadmap, toggleTask, currentRole, showToast } = useApp();
  const [filter, setFilter] = useState("All");

  // Calculate overall task stats
  const allTasks = roadmap.flatMap((w) => w.tasks);
  const completedTasks = allTasks.filter((t) => t.done).length;
  const progressPercent = Math.round((completedTasks / allTasks.length) * 100);

  const filteredRoadmap = roadmap.filter((w) => {
    if (filter === "All") return true;
    return w.status === filter;
  });

  const handleToggle = (weekIdx, taskId) => {
    toggleTask(weekIdx, taskId);
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1>
            <Map size={28} color="var(--indigo-600)" />
            <span>Personalized 8-Week Placement Roadmap</span>
          </h1>
          <p>
            Structured curriculum designed to elevate your problem solving, core computer science, system design, and interview readiness.
          </p>
        </div>

        <div className="page-actions">
          <Link to="/interview-coach">
            <Button variant="primary">
              <Bot size={16} />
              <span>Test Current Milestones in AI Mock</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Progress Bar & Summary Card */}
      <Card style={{ padding: "1.75rem", marginBottom: "2rem" }}>
        <div className="flex items-center justify-between" style={{ marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <div style={{ fontSize: "0.8125rem", color: "var(--navy-500)", fontWeight: 600 }}>
              Curriculum Track for {currentRole.title}
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--navy-900)" }}>
              {completedTasks} of {allTasks.length} Milestones Mastered ({progressPercent}%)
            </h3>
          </div>

          <Badge variant={progressPercent >= 50 ? "emerald" : "indigo"} style={{ fontSize: "0.875rem", padding: "0.4rem 0.8rem" }}>
            {progressPercent}% Complete
          </Badge>
        </div>

        <div className="progress-container" style={{ height: "10px", marginBottom: "1.25rem" }}>
          <div className="progress-bar" style={{ width: `${progressPercent}%` }} />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2" style={{ flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.8125rem", color: "var(--navy-500)", fontWeight: 600, marginRight: "0.5rem" }}>
            Filter Weeks:
          </span>
          {["All", "In Progress", "Completed", "To Do"].map((f) => (
            <button
              key={f}
              className={`btn btn-sm ${filter === f ? "btn-secondary" : "btn-outline"}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </Card>

      {/* Week-by-Week Accordion Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {filteredRoadmap.map((week, originalIndex) => {
          const actualIndex = roadmap.findIndex((w) => w.week === week.week);
          const isDone = week.status === "Completed";
          const isInProgress = week.status === "In Progress";
          const statusBadge =
            isDone ? "emerald" : isInProgress ? "indigo" : "slate";

          return (
            <Card
              key={week.week}
              style={{
                border: isInProgress ? "2px solid var(--indigo-500)" : "1px solid var(--border-color)",
                padding: "1.5rem"
              }}
            >
              <div className="flex items-start justify-between" style={{ marginBottom: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
                <div>
                  <div className="flex items-center gap-2" style={{ marginBottom: "0.25rem" }}>
                    <span style={{ fontSize: "0.8125rem", fontWeight: 800, color: "var(--indigo-600)" }}>
                      {week.week}
                    </span>
                    <span style={{ fontSize: "0.8125rem", color: "var(--navy-400)" }}>•</span>
                    <span style={{ fontSize: "0.8125rem", color: "var(--navy-500)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <Clock size={12} />
                      {week.estimatedHours}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--navy-900)" }}>
                    {week.title}
                  </h3>
                </div>

                <Badge variant={statusBadge}>{week.status}</Badge>
              </div>

              {/* Task Checklist */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {week.tasks.map((task) => (
                  <label
                    key={task.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.65rem 0.85rem",
                      borderRadius: "8px",
                      background: task.done ? "var(--navy-50)" : "#ffffff",
                      border: "1px solid var(--border-color)",
                      cursor: "pointer",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => handleToggle(actualIndex, task.id)}
                      style={{
                        width: "18px",
                        height: "18px",
                        accentColor: "var(--indigo-600)",
                        cursor: "pointer"
                      }}
                    />
                    <span
                      style={{
                        fontSize: "0.875rem",
                        color: task.done ? "var(--navy-400)" : "var(--navy-800)",
                        textDecoration: task.done ? "line-through" : "none",
                        fontWeight: task.done ? 400 : 500
                      }}
                    >
                      {task.text}
                    </span>
                  </label>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
