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
import { useForm, useWatch, useFieldArray } from "react-hook-form"; // ✅ New: imported useFieldArray

const EditTemplate = () => {
  const { templateId } = useParams();
  const axiosSecure = useAxiosSecure();

  // 1) Initialize RHF
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: { questions: [] },
    shouldUnregister: true,
  });

  // ✅ New: setup useFieldArray for "questions"
  const { fields, remove } = useFieldArray({
    control,
    name: "questions",
  });

  // 2) Fetch the template
  const {
    data: template,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["single-template", templateId],
    queryFn: async () =>
      (await axiosSecure.get(`/template/${templateId}`)).data,
  });

  // 3) Seed form on data arrival
  useEffect(() => {
    if (template) {
      reset({ questions: template.questions });
    }
  }, [template, reset]);

  // 4) Watch to know which type is selected
  const formValues = useWatch({ control, name: "questions" });

  // 5) Submission handler
  const onSubmit = (data) => {
    console.log("Question data:", data.questions);
  };

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
        {fields.map((field, index) => {
          // ✅ Changed: iterate over fields instead of template.questions
          const currentType = formValues?.[index]?.type ?? field.type;

          return (
            <Paper key={field.id} elevation={2} sx={{ p: 3, mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Question {index + 1}
              </Typography>

              {/* Title */}
              <TextField
                fullWidth
                label="Question Title"
                defaultValue={field.title}
                margin="normal"
                {...register(`questions.${index}.title`)}
              />

              {/* Description */}
              <TextField
                fullWidth
                label="Description"
                defaultValue={field.description}
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
                defaultValue={field.type}
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
                  {(field.options || []).map((_, optIdx) => (
                    <Box key={optIdx} display="flex" alignItems="center" mb={1}>
                      <TextField
                        size="small"
                        fullWidth
                        defaultValue={field.options[optIdx]}
                        {...register(`questions.${index}.options.${optIdx}`)}
                      />
                      {/* You can hook up remove(optionIndex) here if you use nested useFieldArray */}
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
                        defaultChecked={field.allowMultiple}
                        {...register(`questions.${index}.allowMultiple`)}
                      />
                    }
                    label="Allow multiple selections"
                  />
                )}
                <FormControlLabel
                  control={
                    <Checkbox
                      defaultChecked={field.showInList}
                      {...register(`questions.${index}.showInList`)}
                    />
                  }
                  label="Show in lists"
                />
              </Box>

              {/* Delete Question */}
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => remove(index)} // ✅ New: remove this question from UI
                >
                  Delete Question
                </Button>
              </Box>
            </Paper>
          );
        })}

        {/* Action Buttons */}
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
