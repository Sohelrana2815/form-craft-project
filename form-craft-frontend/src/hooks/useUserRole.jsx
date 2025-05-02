import { useState, useEffect } from "react";
import useAuth from "./useAuth";
import useAxiosPublic from "./useAxiosPublic";
const useUserRole = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const axiosPublic = useAxiosPublic();

  // load user role data

  useEffect(() => {
    const fetchRole = async () => {
      if (!user?.email) {
        setUserRole(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axiosPublic.get(`/users/role/${user.email}`);
        setUserRole(response.data?.userRole);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user role:", err);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };
    fetchRole();
  }, [axiosPublic, user?.email]);

  return { userRole, loading };
};

export default useUserRole;
