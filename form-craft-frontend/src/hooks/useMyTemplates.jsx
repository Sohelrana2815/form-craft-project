import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

const useMyTemplates = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const fetchMyTemplates = async () => {
    const response = await axiosSecure.get("/templates/my-templates");
    return response.data;
  };

  const {
    data: templates,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userTemplates"],
    queryFn: fetchMyTemplates,
    enabled: !!user,
  });

  return { templates, isLoading, isError, error };
};

export default useMyTemplates;
