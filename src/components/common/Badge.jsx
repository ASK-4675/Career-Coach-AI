import React from "react";

export const Badge = ({
  children,
  variant = "indigo", // indigo, emerald, amber, rose, cyan, slate
  size = "md",
  className = "",
  icon: Icon
}) => {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
};
