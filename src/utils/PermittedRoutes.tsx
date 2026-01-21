import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  permissions: string[];
}

const PermittedRoutes: React.FC<ProtectedRouteProps> = ({ permissions }) => {
  const userPermissions = JSON.parse(localStorage.getItem("user_permissions") as string);

  const hasPermission = permissions.some((permission) =>
    userPermissions?.includes(permission)
  );

  return hasPermission ? <Outlet /> : <Navigate to="/not-found" />;
};

export default PermittedRoutes;
