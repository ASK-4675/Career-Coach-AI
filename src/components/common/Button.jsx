import React from "react";

export const Button = ({
  children,
  variant = "primary", // primary, secondary, outline, ghost, danger
  size = "md", // sm, md, lg
  icon: Icon,
  iconPosition = "left",
  loading = false,
  className = "",
  disabled = false,
  ...props
}) => {
  const sizeClass = size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : "";
  const variantClass = `btn-${variant}`;

  return (
    <button
      className={`btn ${variantClass} ${sizeClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="spinner" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === "left" && <Icon size={size === "sm" ? 14 : size === "lg" ? 20 : 16} />}
          {children}
          {Icon && iconPosition === "right" && <Icon size={size === "sm" ? 14 : size === "lg" ? 20 : 16} />}
        </>
      )}
    </button>
  );
};
