import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/AuthStore";

const ProtectedRoutes = ({ role }) => {
  const { isLoggedIn, user } = useAuthStore();

  if (!isLoggedIn || !user) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  if (role === "admin" && user.role === "superadmin") {
    return <Outlet />;
  }

  if (role && user.role !== role) {
    if (user.role === "staff") {
      return <Navigate to="/dashboard" replace />;
    } else if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === "superadmin") {
      return <Navigate to="/super-admin/dashboard" replace />;
    } else {
      return <Navigate to="/auth?mode=login" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoutes;
