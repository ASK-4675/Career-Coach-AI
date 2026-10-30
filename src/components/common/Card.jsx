import React from "react";

export const Card = ({
  children,
  title,
  subtitle,
  action,
  icon: Icon,
  variant = "default", // default, hover, clickable, dark
  className = "",
  onClick,
  ...props
}) => {
  const variantClass =
    variant === "hover"
      ? "card-hover"
      : variant === "clickable"
      ? "card-hover card-clickable"
      : variant === "dark"
      ? "card-dark"
      : "";

  return (
    <div
      className={`card ${variantClass} ${className}`}
      onClick={onClick}
      {...props}
    >
      {(title || action || Icon) && (
        <div className="card-header">
          <div>
            <h3 className="card-title">
              {Icon && <Icon size={18} className="text-indigo" />}
              {title}
            </h3>
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {action && <div className="card-actions">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
