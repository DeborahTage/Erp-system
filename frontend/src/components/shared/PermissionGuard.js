import React from 'react';
import { useAuth } from '../../context/AuthContext';

/**
 * Conditionally renders children when the user has the required permission.
 */
const PermissionGuard = ({ permission, permissions, action, resource, children, fallback = null }) => {
  const { hasPermission, hasAnyPermission, canPerformAction } = useAuth();

  if (permission && !hasPermission(permission)) {
    return fallback;
  }

  if (permissions && permissions.length > 0 && !hasAnyPermission(permissions)) {
    return fallback;
  }

  if (action && resource && !canPerformAction(action, resource)) {
    return fallback;
  }

  return <>{children}</>;
};

export default PermissionGuard;
