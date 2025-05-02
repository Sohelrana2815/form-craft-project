import useAxiosSecure from "./useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const useUsers = () => {
  const axiosSecure = useAxiosSecure();
  // Load users
  const fetchUsers = async () => {
    const response = await axiosSecure.get("/users");
    return response.data;
  };
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
};

export default useUsers;
