import { Navigate, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";
import useUsers from "../hooks/useUsers";

const PrivateRoute = ({ children, requiredRole }) => {
  const { isLoading: usersLoading } = useUsers();
  const { loading: authLoading, user, userRole } = useAuth();
  const location = useLocation();

  if (authLoading || usersLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="loading loading-dots loading-xl text-blue-700"></p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default PrivateRoute;
