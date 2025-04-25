import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const useTemplates = () => {
  const axiosPublic = useAxiosPublic();

  const fetchTemplates = async () => {
    const response = await axiosPublic.get("/templates");
    return response.data;
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["templates"],
    queryFn: fetchTemplates,
  });

  return { data, isLoading, isError, error };
};

export default useTemplates;
