import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { Navigate, useLocation } from "react-router";

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false); // by default admin is false
  const [loading, setLoading] = useState(true);
  const axiosPublic = useAxiosPublic();
  const location = useLocation();

  useEffect(() => {
    const checkAdmin = async () => {
      if (user?.email) {
        try {
          const adminRes = await axiosPublic.get(`/users/role/${user.email}`);
          setIsAdmin(adminRes.data.userRole === "admin");
        } catch (error) {
          console.error("Admin check failed:", error);
          setIsAdmin(false);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [axiosPublic, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }

  return isAdmin ? (
    children
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

export default AdminRoute;
