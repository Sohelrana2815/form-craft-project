import { Navigate, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const { loading, user } = useAuth();
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="loading loading-dots loading-xl text-blue-700"></p>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

export default PrivateRoute;
