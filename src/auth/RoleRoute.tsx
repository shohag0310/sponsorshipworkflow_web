import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

type Props = {
  children: React.ReactElement;
  allowedRoles: string[];
};

export const RoleRoute = ({ children, allowedRoles }: Props) => {
  const { role } = useAuth();
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (role && !allowedRoles.includes(role)) {
    return <div className="p-6">Access Denied</div>;
  }

  return children;
};