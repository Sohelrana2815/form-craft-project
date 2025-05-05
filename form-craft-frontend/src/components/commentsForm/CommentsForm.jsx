import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useParams } from "react-router";
import CommentLists from "./CommentLists";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import { useTheme } from "../../providers/ThemeProvider";

// ------------------------------ IMPORT ----------------------------------//
const CommentsForm = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [commentText, setCommentText] = useState("");
  const { id } = useParams();
  const templateId = parseInt(id, 10);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient(); // Get the query client
  const {
    mutate: addComment,
    isLoading,
    isError,
    error,
  } = useMutation({
    mutationFn: (text) =>
      axiosSecure.post(`/templates/${templateId}/comments`, { text }),
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", templateId]);
      setCommentText("");
      toast.success("Thanks for comment", {
        theme: "dark",
        autoClose: 1000,
      });
    },
    onError: (err) => {
      console.error("Error adding comment:", err);
      const message = err.response?.data?.error;
      toast.error(message, {
        theme: "dark",
      });
    },
  });

  const handleCommentChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      addComment(commentText);
    }
  };

  return (
    <>
      <form onSubmit={handleCommentSubmit}>
        <Box>
          <TextField
            disabled={!user}
            // disabled
            multiline
            rows={3}
            value={commentText}
            onChange={handleCommentChange}
            label="Comments"
            placeholder="Type something to enable this comment button."
            fullWidth
            margin="normal"
            sx={{
              // Label styling
              "& .MuiInputLabel-root": {
                color: isDark ? "#E0E0E0" : undefined,
              },
              // Input field styling
              "& .MuiOutlinedInput-root": {
                color: isDark ? "#E0E0E0" : undefined,
                backgroundColor: isDark ? "#424242" : undefined,
              },
              "& fieldset": {
                borderColor: isDark ? "#757575" : undefined,
              },
            }}
          />
          <Box className="flex justify-end">
            <Button
              disabled={!commentText.trim() || isLoading}
              type="submit"
              variant="contained"
              color="success"
              className="justify-end"
              sx={{
                backgroundColor: isDark ? "#2e7d32" : undefined,
                color: "#ffffff",
                // (Disabled state)
                "&.Mui-disabled": {
                  backgroundColor: isDark ? "#424242" : undefined,
                  color: isDark ? "#757575" : undefined,
                },
              }}
            >
              {isLoading ? "Posting..." : `Comment`}
            </Button>
          </Box>
          {isError && <div>{error.message}</div>}
        </Box>
      </form>
      {/* Comments */}
      <CommentLists templateId={templateId} />
    </>
  );
};

export default CommentsForm;
