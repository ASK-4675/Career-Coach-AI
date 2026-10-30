import React from "react";
import { FolderSearch, AlertTriangle } from "lucide-react";
import { Button } from "./Button";

export const EmptyState = ({
  icon: Icon = FolderSearch,
  title = "No data found",
  description = "There are currently no items matching your criteria.",
  actionText,
  onAction,
  isError = false
}) => {
  return (
    <div className="empty-state">
      <div
        className="empty-state-icon"
        style={{
          background: isError ? "var(--rose-50)" : "var(--indigo-50)",
          color: isError ? "var(--rose-600)" : "var(--indigo-600)"
        }}
      >
        {isError ? <AlertTriangle size={24} /> : <Icon size={24} />}
      </div>
      <h4 className="empty-state-title">{title}</h4>
      <p className="empty-state-desc">{description}</p>
      {actionText && onAction && (
        <Button
          variant={isError ? "danger" : "primary"}
          size="sm"
          onClick={onAction}
        >
          {actionText}
        </Button>
      )}
    </div>
  );
};
