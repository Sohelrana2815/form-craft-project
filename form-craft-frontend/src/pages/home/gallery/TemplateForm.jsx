import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Box,
} from "@mui/material";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import CommentsForm from "../../../components/commentsForm/CommentsForm";
import LikeButton from "../../../components/likesStatus/LikeButton";
import { useTheme } from "../../../providers/ThemeProvider";
// ------------------------------ IMPORT ----------------------------------//

const TemplateForm = () => {
  const { id } = useParams();
  const { isDark } = useTheme();
  const axiosPublic = useAxiosPublic();
  const { register, handleSubmit } = useForm();
  const { user } = useAuth();
  // Fetch single template
  const fetchTemplate = async () => {
    const response = await axiosPublic.get(`/templates/${id}`);
    return response.data;
  };

  // React tanstack query to load template data
  const {
    data: template,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["template", id],
    queryFn: fetchTemplate,
  });

  // React main onsubmit handler to submit template form

  const onSubmit = async (data) => {
    try {
      // await axiosPublic.post(`/forms/${id}`, data);
      console.log(data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to submit the form", "error");
    }
  };

  // Show loading & error

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>{error.message}</p>;
  if (!template) return <p>No template found.</p>;

  const renderQuestions = (qPrefix, type = "text") => {
    return Array.from({ length: 4 }, (_, i) => {
      const questionNumber = i + 1;
      // question property
      const questionKey = `${qPrefix}${questionNumber}`;
      // Actual question value
      const question = template[questionKey];
      // Remove white spaces and try to get the question it self
      if (!question?.trim()) return null;

      return (
        <TextField
          disabled={!user}
          key={questionKey}
          fullWidth
          label={question}
          type={type}
          margin="normal"
          sx={{
            input: {
              color: isDark ? "white" : "black",
            },
            label: {
              color: isDark ? "white" : "black",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: isDark ? "white" : "black",
              },
              "&:hover fieldset": {
                borderColor: isDark ? "white" : "black",
              },
              "&.Mui-focused fieldset": {
                borderColor: isDark ? "white" : "black",
              },
            },
          }}
          InputProps={{
            inputProps: {
              min: type === "number" ? 0 : undefined,
            },
          }}
          {...register(questionKey)}
        />
      );
    });
  };

  const renderCheckboxQuestions = () => {
    return Array.from({ length: 4 }, (_, i) => {
      const questionNumber = i + 1;
      const questionKey = `checkboxQ${questionNumber}Question`;
      const question = template[questionKey];

      if (!question?.trim()) return null;

      const options = Array.from({ length: 4 }, (_, j) => {
        const optionNumber = j + 1;
        return template[`checkboxQ${questionNumber}Option${optionNumber}`];
      }).filter((opt) => opt?.trim());

      return (
        <Box key={questionKey} sx={{ mb: 3 }}>
          <p className="mb-2 font-medium">{question}</p>
          {options.map((option, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  disabled={!user}
                  value={option}
                  {...register(`checkboxQ${questionNumber}`)}
                />
              }
              label={option}
            />
          ))}
        </Box>
      );
    });
  };

  return (
    <>
      <div className="p-8 max-w-5xl mx-auto">
        {!user && (
          <div className="text-red-500 text-center my-4">
            Please login to fill out this template.
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Common Fields */}
          <div className="mb-8">
            {template.imageUrl && (
              <img
                src={template.imageUrl}
                alt={template.title}
                className="mb-4 rounded-lg max-h-64 object-cover"
              />
            )}
            <h1 className="text-2xl font-bold mb-2">{template.title}</h1>

            <div className="prose mb-4">
              <ReactMarkdown>{template.description}</ReactMarkdown>
            </div>

            <div className="flex gap-2 mb-4">
              <span className="bg-gray-200 px-2 py-1 rounded dark:text-gray-800">
                {template.topic}
              </span>
              {template.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 px-2 py-1 rounded dark:text-gray-800"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Questions */}

          <div className="space-y-4">
            {/* Short Questions */}
            {renderQuestions("shortQ", "text")}

            {/* Paragraph Questions */}
            {renderQuestions("desQ", "textarea")}

            {/* Numeric Questions */}
            {renderQuestions("positiveInt", "number")}

            {/* Checkbox Questions */}
            {renderCheckboxQuestions()}
          </div>

          <Button
            type="submit"
            disabled
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
          >
            Submit Form
          </Button>
          <p className="text-red-600">
            Not build yet. soon it will be functional
          </p>
        </form>
        {/* Likes and comments section */}
        <LikeButton />
        <CommentsForm />
      </div>
    </>
  );
};

export default TemplateForm;
