import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import { TextField, Checkbox, FormControlLabel, Button } from "@mui/material";
import Swal from "sweetalert2";

const TemplateForm = () => {
  const { id } = useParams();
  const axiosPublic = useAxiosPublic();
  const { register, handleSubmit } = useForm();

  // Fetch single template data

  const fetchTemplate = async () => {
    const response = await axiosPublic.get(`/template/${id}`);
    return response.data;
  };
  // Tanstack query
  const {
    data: template,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["template", id],
    queryFn: fetchTemplate,
  });
  // Template form data collect and submit form
  const onSubmit = async (data) => {
    try {
      const response = axiosPublic.post(`/form/${id}`, data);
      Swal.fire("Form submitted successfully!", "", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to submit form", "error");
    }
  };

  // Loading & error state
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>{error.message}</p>;
  if (!template) return <p>No template found.</p>;

  const renderQuestion = (question, show, label, type = "text") => {
    if (!show || !question) return null;

    return <TextField />;
  };
};

export default TemplateForm;
