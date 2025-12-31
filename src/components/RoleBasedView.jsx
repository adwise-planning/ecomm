import React from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * A component that conditionally renders its children based on the user's permissions.
 * @param {object} props - The component props.
 * @param {string} props.permission - The permission string required to render the children (e.g., "billing.can_view_own_billing").
 * @param {React.ReactNode} props.children - The content to render if the user has the required permission.
 */
const RoleBasedView = ({ permission, children }) => {
  const { hasPermission } = useAuth();

  if (hasPermission(permission)) {
    return <>{children}</>;
  }

  return null;
};

export default RoleBasedView;
