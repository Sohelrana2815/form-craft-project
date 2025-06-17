import { useEffect } from "react";
import { useParams } from "react-router";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { FiMinusCircle } from "react-icons/fi";
import {
  Alert,
  CircularProgress,
  Typography,
  TextField,
  MenuItem,
  Button,
  Checkbox,
  FormControlLabel,
  Box,
  Paper,
  Divider,
} from "@mui/material";
import { FaPen } from "react-icons/fa";
import { useForm, useWatch } from "react-hook-form";

const EditTemplate = () => {
  const { templateId } = useParams();
  const axiosSecure = useAxiosSecure();

  // 1) Initialize RHF with an empty questions array
  const {
    register,
    handleSubmit,
    control,
    reset, // we’ll use this to seed the form
    formState: { isSubmitting },
  } = useForm({
    defaultValues: { questions: [] },
    shouldUnregister: true, // unmounting fields get removed from form state
  });

  // 2) Fetch the template
  const {
    data: template,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["single-template", templateId],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/template/${templateId}`);
      return data;
    },
  });

  // 3) When template arrives, reset the form to its questions
  useEffect(() => {
    if (template) {
      reset({ questions: template.questions });
    }
  }, [template, reset]);

  // 4) Watch to get live form values (for conditional UI)
  const formValues = useWatch({ control, name: "questions" });

  // 5) Submission handler
  const onSubmit = (data) => {
    console.log("Question data:", data.questions);
    // TODO: call your API to save changes
  };

  // Loading / error states
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }
  if (isError || !template) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Error loading template. Please try again later.
      </Alert>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      {/* Template Details */}
      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Template
        </Typography>
        <Box display="flex" gap={3}>
          <Typography variant="body1">
            <strong>Title:</strong> {template.title}
          </Typography>
          <Typography variant="body1">
            <strong>Topic:</strong> {template.topic?.name || "No topic"}
          </Typography>
        </Box>
      </Paper>

      {/* Questions Section */}
      <Typography
        variant="h6"
        gutterBottom
        className="flex items-center gap-x-2"
      >
        <FaPen className="text-blue-500" /> Edit Questions
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <form onSubmit={handleSubmit(onSubmit)}>
        {template.questions.map((_, index) => {
          // Determine the currently selected type
          const currentType =
            formValues?.[index]?.type ?? template.questions[index].type;

          return (
            <Paper
              key={template.questions[index].id}
              elevation={2}
              sx={{ p: 3, mb: 3 }}
            >
              <Typography
                variant="subtitle1"
                color="textSecondary"
                gutterBottom
              >
                Question {index + 1}
              </Typography>

              {/* Title */}
              <TextField
                fullWidth
                label="Question Title"
                defaultValue={template.questions[index].title}
                margin="normal"
                {...register(`questions.${index}.title`)}
              />

              {/* Description */}
              <TextField
                fullWidth
                label="Description"
                defaultValue={template.questions[index].description}
                margin="normal"
                multiline
                rows={3}
                {...register(`questions.${index}.description`)}
              />

              {/* Type selector */}
              <TextField
                select
                fullWidth
                label="Question Type"
                defaultValue={template.questions[index].type}
                margin="normal"
                {...register(`questions.${index}.type`)}
              >
                <MenuItem value="SHORT_TEXT">Short Text</MenuItem>
                <MenuItem value="LONG_TEXT">Long Text</MenuItem>
                <MenuItem value="INTEGER">Integer</MenuItem>
                <MenuItem value="CHOICE">Multiple Choice</MenuItem>
              </TextField>

              {/* Options only when CHOICE */}
              {currentType === "CHOICE" && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Options:
                  </Typography>
                  {template.questions[index].options.map((_, optIdx) => (
                    <Box key={optIdx} display="flex" alignItems="center" mb={1}>
                      <TextField
                        fullWidth
                        defaultValue={template.questions[index].options[optIdx]}
                        size="small"
                        {...register(`questions.${index}.options.${optIdx}`)}
                      />
                      <Button color="error" sx={{ ml: 1 }}>
                        <FiMinusCircle />
                      </Button>
                    </Box>
                  ))}
                  <Button variant="outlined" sx={{ mt: 1 }}>
                    Add Option
                  </Button>
                </Box>
              )}

              {/* Checkboxes */}
              <Box sx={{ mt: 2 }}>
                {currentType === "CHOICE" && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        defaultChecked={template.questions[index].allowMultiple}
                        {...register(`questions.${index}.allowMultiple`)}
                      />
                    }
                    label="Allow multiple selections"
                  />
                )}
                <FormControlLabel
                  control={
                    <Checkbox
                      defaultChecked={template.questions[index].showInList}
                      {...register(`questions.${index}.showInList`)}
                    />
                  }
                  label="Show in lists"
                />
              </Box>

              {/* Delete Question */}
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button variant="contained" color="error">
                  Delete Question
                </Button>
              </Box>
            </Paper>
          );
        })}

        {/* Save Changes */}
        <Box display="flex" justifyContent="flex-end" mt={4} gap={2}>
          <Button variant="outlined" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={isSubmitting}
          >
            Save Changes
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditTemplate;
