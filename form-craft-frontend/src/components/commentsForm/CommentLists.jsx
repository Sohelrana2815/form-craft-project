import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { useEffect } from "react";
// ------------------------------ IMPORT ----------------------------------//
const CommentLists = ({ templateId }) => {
  const axiosPublic = useAxiosPublic();
  const fetchComments = async () => {
    const response = await axiosPublic.get(`/templates/${templateId}/comments`);
    return response.data;
  };

  const {
    data: comments,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["comments", templateId],
    queryFn: fetchComments,
    enabled: !!templateId,
  });
  useEffect(() => {
    if (templateId) {
      refetch(); // Fetch comments when templateId changes
    }
  }, [templateId, refetch]);
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>{error.message}</div>;
  return (
    <div>
      <h3>Comments: {comments.length}</h3>
      {comments?.map((comment) => (
        <div key={comment.id} className="border p-4 my-2">
          <h2>
            Author: <span className="font-bold">{comment.author.name}</span>
          </h2>
          <p>{comment.text}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentLists;
