import { useParams } from "react-router";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AiOutlineLike } from "react-icons/ai";
import { Bounce, toast, ToastContainer } from "react-toastify";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { Typography } from "@mui/material";
// ------------------------------ IMPORT ----------------------------------//
const LikeButton = () => {
  const { user } = useAuth();
  const { id } = useParams();
  // Convert to integer number
  const templateId = parseInt(id, 10);
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const queryClient = useQueryClient();

  // Fetch like data
  const fetchLikeData = async () => {
    const response = await axiosPublic.get(`/templates/${templateId}/likes`);
    return response.data;
  };

  const {
    data: likeData,
    isLoading: isLikeDataLoading,
    isError: isLikeDataError,
    error: likeDataError,
  } = useQuery({
    queryKey: ["templates", templateId, "likes"],
    queryFn: fetchLikeData,
    enabled: !!templateId && !isNaN(templateId),
  });

  // Loads likes and status

  const { mutate: addLikeMutation, isLoading: isLiking } = useMutation({
    mutationFn: () => axiosSecure.post(`/templates/${templateId}/likes`),
    onSuccess: () => {
      queryClient.invalidateQueries(["likes", templateId]);
      toast.success("Template liked successfully!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    },
    onError: (error) => {
      console.error("Error liking template:", error);

      const message =
        error.response?.data?.error ||
        (error.response?.status === 409
          ? "You've already liked this template"
          : "Failed to like template");

      toast.error(message, {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    },
  });

  const handleLike = () => {
    addLikeMutation();
  };

  if (isLikeDataLoading) {
    return <Typography>likes...</Typography>;
  }
  if (isLikeDataError) {
    return (
      <Typography color="error">
        Error loading likes: {likeDataError.message}
      </Typography>
    );
  }

  // Once data is loaded, access and display the likeCount
  const currentLikeCount = likeData?.likeCount || 0; // Use optional chaining and default to 0

  return (
    <div className="my-4">
      <button
        disabled={!user}
        onClick={handleLike}
        className="btn btn-outline "
      >
        {isLiking ? "Liking..." : <AiOutlineLike className="text-2xl" />}
      </button>
      {/* Display the like count */}
      <Typography variant="body1">{currentLikeCount} Likes</Typography>

      <ToastContainer />
    </div>
  );
};

export default LikeButton;
