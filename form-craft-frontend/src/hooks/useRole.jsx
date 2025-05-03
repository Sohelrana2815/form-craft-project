import { useState, useEffect } from "react";
import useAuth from "./useAuth";
import useAxiosPublic from "./useAxiosPublic";

const useRole = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        if (user?.email) {
          const response = await axiosPublic.get(`/users/role/${user.email}`);
          setUserRole(response.data.userRole);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch user role");
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [user, axiosPublic]);

  return {
    role: userRole,
    isLoading: loading,
    error,
  };
};

export default useRole;
