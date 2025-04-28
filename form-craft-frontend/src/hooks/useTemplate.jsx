import useAxiosSecure from "./useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
const useTemplate = (templateId) => {
  const axiosSecure = useAxiosSecure();

  const fetchTemplate = async () => {
    const response = await axiosSecure.get(`/templates/${templateId}`);
    return response.data;
  };

  return useQuery({
    queryKey: ["template", templateId],
    queryFn: fetchTemplate,
    enabled: !!templateId,
  });
};

export default useTemplate;
