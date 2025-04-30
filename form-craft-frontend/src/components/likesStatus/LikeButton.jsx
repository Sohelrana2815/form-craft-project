import { useParams } from "react-router";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AiOutlineLike } from "react-icons/ai";
// ------------------------------ IMPORT ----------------------------------//
const LikeButton = () => {
  const { user } = useAuth();
  const { id } = useParams();
  // Convert to integer number
  const templateId = parseInt(id, 10);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Loads likes and status

  const { mutate: addLikeMutation, isLoading } = useMutation({
    mutationFn: () => axiosSecure.post(`/templates/${templateId}/likes`),
    onSuccess: () => {
      queryClient.invalidateQueries(["likes", templateId]);
    },
    onError: (error) => {
      console.error("Error liking template:", error);
      if (error.response && error.response.status === 409) {
        alert("You have already liked this template.");
      } else {
        alert("Failed to like template. Please try again.");
      }
    },
  });

  const handleLike = () => {
    addLikeMutation();
  };

  return (
    <div className="my-4">
      <button
        disabled={!user}
        onClick={handleLike}
        className="btn btn-outline "
      >
        {isLoading ? "Liking..." : <AiOutlineLike className="text-2xl" />}
      </button>
    </div>
  );
};

export default LikeButton;
