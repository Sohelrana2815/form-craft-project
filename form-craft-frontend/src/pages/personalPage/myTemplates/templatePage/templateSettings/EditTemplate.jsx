import { useParams } from "react-router";
import { useEffect } from "react";
import useTemplate from "../../../../../hooks/useTemplate";
import useAxiosPublic from "../../../../../hooks/useAxiosPublic";
import { useForm } from "react-hook-form";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
//--------------------------------------------------//
const EditTemplate = () => {
  const { id } = useParams();
  const axiosPublic = useAxiosPublic();
  const { data: template, isLoading, isError, error } = useTemplate(id);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm();

  // Add this useEffect to reset form when template loads

  useEffect(() => {
    if (template) {
      reset(template);
    }
  }, [template, reset]);

  const onSubmit = async (data) => {
    // console.log("Edit template page:", data);
    try {
      const response = await axiosPublic.patch(`/templates/${id}`, data);

      const editSuccess = new Promise((resolve) => setTimeout(resolve, 2000));

      if (response.data?.id) {
        toast.promise(
          editSuccess,
          {
            pending: "Updating...",
            success: "Update successfully!",
            error: "Unable to update",
          },
          {
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          }
        );
      }

      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const maxQuestionCounts = [1, 2, 3, 4];
  const maxOptions = [1, 2, 3, 4];

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>{error.message}</div>;
  if (!template) return <div>No template found.</div>;

  return (
    <div className="max-w-5xl mx-auto my-10 p-10 border">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box className="flex justify-end">
          <Button type="submit" variant="contained" size="small">
            {isSubmitting ? "Saving..." : "Saved Changes"}
          </Button>
        </Box>
        {maxQuestionCounts.map((num) => (
          <TextField
            key={`shortQ${num}`}
            {...register(`shortQ${num}`)}
            type="text"
            fullWidth
            margin="normal"
            label={`Short Q ${num}`}
            defaultValue={template?.[`shortQ${num}`] || ""}
          />
        ))}

        {maxQuestionCounts.map((num) => (
          <TextField
            key={`desQ${num}`}
            {...register(`desQ${num}`)}
            fullWidth
            type="text"
            margin="normal"
            multiline
            rows={2}
            label={`Descriptive Q ${num}`}
            defaultValue={template?.[`desQ${num}`] || ""}
          />
        ))}

        {maxQuestionCounts.map((num) => (
          <TextField
            key={`positiveInt${num}`}
            {...register(`positiveInt${num}`)}
            fullWidth
            type="text"
            margin="normal"
            label={`Numeric type Q ${num}`}
            defaultValue={template?.[`positiveInt${num}`] || ""}
          />
        ))}

        <Box sx={{ mt: 4, p: 2, border: "1px solid #ddd", borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Checkbox Questions
          </Typography>

          {maxQuestionCounts.map((num) => (
            <Box
              key={`checkbox-${num}`}
              sx={{ mb: 4, p: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}
            >
              {/* Checkbox Question */}
              <TextField
                {...register(`checkboxQ${num}Question`)}
                fullWidth
                margin="normal"
                label={`Checkbox Question ${num}`}
                defaultValue={template?.[`checkboxQ${num}Question`] || ""}
              />

              {/* Checkbox Options */}
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {maxOptions.map((optionNum) => (
                  <Grid key={`checkbox-${num}-option-${optionNum}`}>
                    <TextField
                      {...register(`checkboxQ${num}Option${optionNum}`)}
                      fullWidth
                      margin="normal"
                      label={`Option ${optionNum}`}
                      defaultValue={
                        template?.[`checkboxQ${num}Option${optionNum}`] || ""
                      }
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
          <ToastContainer />
        </Box>
      </form>
    </div>
  );
};

export default EditTemplate;
