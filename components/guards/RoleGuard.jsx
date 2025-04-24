import React from "react";
import { useSelector } from "react-redux";

const RoleGuard = ({ roles, children, fallback = null }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) return fallback;

  const userRole = user.role;
  let hasAccess = false;

  if (Array.isArray(roles)) {
    hasAccess = roles.includes(userRole);
  } else {
    hasAccess = userRole === roles;
  }

  return hasAccess ? children : fallback;
};

export default RoleGuard;
