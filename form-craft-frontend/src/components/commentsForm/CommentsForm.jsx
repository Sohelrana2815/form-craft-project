import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useParams } from "react-router";
import CommentLists from "./CommentLists";
import useAuth from "../../hooks/useAuth";
import { useTheme } from "../../providers/ThemeProvider";
import { toast } from "react-toastify";
// ------------------------------ IMPORT ----------------------------------//
const CommentsForm = () => {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState("");
  const { id } = useParams();
  const templateId = parseInt(id, 10);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient(); // Get the query client
  const { isDark } = useTheme();
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
        autoClose: "1500",
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
            multiline
            rows={3}
            value={commentText}
            onChange={handleCommentChange}
            label="Comments"
            placeholder="Type something to enable this comment button."
            fullWidth
            margin="normal"
            sx={{
              /* label */
              "& .MuiInputLabel-root": {
                color: isDark ? "white" : "black",
              },

              /* the textarea text */
              "& .MuiOutlinedInput-input": {
                color: isDark ? "white" : "black",
              },
              "& .MuiOutlinedInput-inputMultiline": {
                color: isDark ? "white" : "black",
              },

              /* the outline itself */
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: isDark ? "white" : "black",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: isDark ? "white" : "black",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: isDark ? "white" : "black",
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
