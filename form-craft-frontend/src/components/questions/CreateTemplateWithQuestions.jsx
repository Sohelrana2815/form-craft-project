import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Autocomplete,
  Checkbox,
  Typography,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Collapse,
  Card,
  CardContent,
} from "@mui/material";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

// --- 1. Validation Schema (Yup) ---

const questionSchema = yup.object({
  type: yup
    .string()
    .oneOf(["SHORT_TEXT", "LONG_TEXT", "INTEGER", "CHOICE"])
    .required(),
  title: yup.string().trim().required().max(200),
  description: yup.string().nullable(),
  showInList: yup.boolean().required(),
  allowMultiple: yup.boolean().when("type", {
    is: "CHOICE",
    then: yup.boolean().required(),
    otherwise: yup.boolean().notRequired(),
  }),
  options: yup.array().when("type", {
    is: "CHOICE",
    then: yup
      .array()
      .of(yup.string().trim().required().max(100))
      .min(1, "At least one option is required")
      .max(4, "Up to 4 options allowed")
      .required(),
    otherwise: yup.array().notRequired(),
  }),
  order: yup.number().integer().min(0).required(),
});

const schema = yup.object({
  title: yup.string().trim().required("Title is required").max(255),
  description: yup.string().trim().required("Description is required"),
  topicId: yup.number().required("Topic is required"),
  tags: yup
    .array()
    .of(yup.string().trim().required())
    .min(1, "At least one tag")
    .notRequired(),
  imageUrl: yup.string().url("Must be a valid URL").nullable(),
  accessType: yup.string().oneOf(["PUBLIC", "RESTRICTED"]).required(),
  allowedUsers: yup.array().when("accessType", {
    is: "RESTRICTED",
    then: yup
      .array()
      .of(yup.number().integer().positive("User ID must be positive"))
      .min(1, "Select at least one user")
      .required(),
    otherwise: yup.array().notRequired(),
  }),
  questions: yup
    .array()
    .of(questionSchema.required())
    .min(1, "At least one question is required")
    .max(16, "You can’t have more than 16 questions total"), // 4 per type × 4 types = 16
});

// --- 2. Mocked “fetch” helper stubs for topics, existing tags, existing users ---

// In real code, replace with API calls (e.g. axios.get("/api/topics"))
const getTopics = async () => [
  { id: 1, name: "Programming" },
  { id: 2, name: "Education" },
  { id: 3, name: "Quiz" },
];
const getAllTags = async () => [
  "web-dev",
  "frontend",
  "backend",
  "database",
  "ui-ux",
];
const getAllUsers = async () => [
  { id: 2, username: "John Doe" },
  { id: 3, username: "Jane Smith" },
  { id: 5, username: "Michael M." },
  { id: 7, username: "Alice Admin" },
];

// --- 3. Main Component ---

export default function CreateTemplateWithQuestions() {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      topicId: "",
      tags: [],
      imageUrl: "",
      accessType: "PUBLIC",
      allowedUsers: [],
      questions: [],
    },
  });

  // --- 3a. For dynamic questions, useFieldArray ---
  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  // --- 3b. Load dropdown data (topics, tags, users) ---
  const [topics, setTopics] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    getTopics().then(setTopics);
    getAllTags().then(setAllTags);
    getAllUsers().then(setAllUsers);
  }, []);

  // --- 3c. Watch question types to enforce “≤ 4 per type” ---
  const questions = watch("questions"); // array of question objects
  const typeCounts = questions.reduce(
    (acc, q) => {
      acc[q.type] = (acc[q.type] || 0) + 1;
      return acc;
    },
    { SHORT_TEXT: 0, LONG_TEXT: 0, INTEGER: 0, CHOICE: 0 }
  );

  // Handler to add a blank question of a given type
  const handleAddQuestion = (type) => {
    if (typeCounts[type] >= 4) return; // do nothing if already 4 of that type

    // Determine new index/order
    const newIndex = fields.length; // 0‐based
    append({
      type,
      title: "",
      description: "",
      showInList: true,
      allowMultiple: false,
      options: [],
      order: newIndex,
    });
  };

  // --- 4. Form Submission: call your two APIs in sequence ---
  const onSubmit = async (data) => {
    try {
      // 4.1. Create the template
      const templatePayload = {
        title: data.title.trim(),
        description: data.description.trim(),
        topicId: Number(data.topicId),
        tags: data.tags, // array of strings
        imageUrl: data.imageUrl || null,
        accessType: data.accessType,
        allowedUsers:
          data.accessType === "RESTRICTED"
            ? data.allowedUsers.map((u) => Number(u))
            : [],
      };

      const createTemplateRes = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(templatePayload),
      });
      if (!createTemplateRes.ok) {
        throw new Error(
          `Template creation failed: ${await createTemplateRes.text()}`
        );
      }
      const { template } = await createTemplateRes.json();
      const templateId = template.id;

      // 4.2. Create questions
      // Build payload exactly as your API expects
      const questionsPayload = {
        questions: data.questions.map((q, idx) => ({
          title: q.title.trim(),
          description: q.description?.trim() || null,
          type: q.type,
          showInList: q.showInList,
          order: idx, // use the index in array as order
          allowMultiple: q.type === "CHOICE" ? q.allowMultiple : false,
          options: q.type === "CHOICE" ? q.options.map((o) => o.trim()) : [],
        })),
      };

      const createQuestionsRes = await fetch(
        `/api/templates/${templateId}/questions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(questionsPayload),
        }
      );
      if (!createQuestionsRes.ok) {
        throw new Error(
          `Questions creation failed: ${await createQuestionsRes.text()}`
        );
      }

      // Both calls succeeded
      alert("Template & Questions created successfully!");
      // Optionally: redirect to “/templates” or clearing form, etc.
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    }
  };

  // --- 5. Render ---
  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ maxWidth: 900, mx: "auto", p: 2 }}
    >
      <Typography variant="h4" gutterBottom>
        Create New Template
      </Typography>

      {/* ─────── Template Details ─────── */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Template Details
          </Typography>
          <Grid container spacing={2}>
            {/* Title */}
            <Grid item xs={12}>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Title"
                    fullWidth
                    error={!!errors.title}
                    helperText={errors.title?.message}
                  />
                )}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description (Markdown)"
                    fullWidth
                    multiline
                    minRows={3}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>

            {/* Topic Dropdown */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="topicId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.topicId}>
                    <InputLabel id="topic-label">Topic</InputLabel>
                    <Select
                      {...field}
                      labelId="topic-label"
                      label="Topic"
                      value={field.value || ""}
                    >
                      {topics.map((t) => (
                        <MenuItem key={t.id} value={t.id}>
                          {t.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <Typography variant="caption" color="error" sx={{ ml: 1 }}>
                      {errors.topicId?.message}
                    </Typography>
                  </FormControl>
                )}
              />
            </Grid>

            {/* Tags Autocomplete (freeSolo) */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    multiple
                    freeSolo
                    options={allTags}
                    onChange={(_, value) => field.onChange(value)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Tags (type or select)"
                        error={!!errors.tags}
                        helperText={errors.tags?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>

            {/* Image URL */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="imageUrl"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Cover Image URL"
                    fullWidth
                    error={!!errors.imageUrl}
                    helperText={errors.imageUrl?.message}
                  />
                )}
              />
            </Grid>

            {/* Access Type (Radio) */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="accessType"
                control={control}
                render={({ field }) => (
                  <FormControl component="fieldset" error={!!errors.accessType}>
                    <Typography>Access Type</Typography>
                    <RadioGroup
                      {...field}
                      row
                      onChange={(e) => field.onChange(e.target.value)}
                    >
                      <FormControlLabel
                        value="PUBLIC"
                        control={<Radio />}
                        label="Public"
                      />
                      <FormControlLabel
                        value="RESTRICTED"
                        control={<Radio />}
                        label="Restricted"
                      />
                    </RadioGroup>
                    <Typography variant="caption" color="error" sx={{ ml: 1 }}>
                      {errors.accessType?.message}
                    </Typography>
                  </FormControl>
                )}
              />
            </Grid>

            {/* Allowed Users (only if RESTRICTED) */}
            {watch("accessType") === "RESTRICTED" && (
              <Grid item xs={12}>
                <Controller
                  name="allowedUsers"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      multiple
                      options={allUsers.map((u) => u.id)}
                      getOptionLabel={(id) => {
                        const user = allUsers.find((u) => u.id === id);
                        return user ? user.username : id.toString();
                      }}
                      onChange={(_, value) => field.onChange(value)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Allowed Users"
                          error={!!errors.allowedUsers}
                          helperText={errors.allowedUsers?.message}
                        />
                      )}
                    />
                  )}
                />
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* ─────── Questions Editor ─────── */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Questions
          </Typography>

          {/* Summary counters */}
          <Box mb={2}>
            {["SHORT_TEXT", "LONG_TEXT", "INTEGER", "CHOICE"].map((type) => (
              <Typography
                key={type}
                variant="body2"
                component="span"
                sx={{ mr: 2 }}
              >
                {type} ({typeCounts[type] || 0}/4)
              </Typography>
            ))}
          </Box>

          {/* “Add Question” Buttons */}
          <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
            {["SHORT_TEXT", "LONG_TEXT", "INTEGER", "CHOICE"].map((type) => (
              <Button
                key={type}
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                disabled={typeCounts[type] >= 4}
                onClick={() => handleAddQuestion(type)}
              >
                Add {type.replace("_", " ").toLowerCase()} question
              </Button>
            ))}
          </Box>

          {/* Render each question row */}
          <Box>
            {fields.map((fieldItem, index) => (
              <QuestionRow
                key={fieldItem.id}
                index={index}
                control={control}
                remove={remove}
                totalCount={fields.length}
              />
            ))}
            {errors.questions && (
              <Typography color="error" variant="body2">
                {errors.questions?.message}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* ─────── Publish Button ─────── */}
      <Box textAlign="center" mb={4}>
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Publishing…" : "Publish Template"}
        </Button>
      </Box>
    </Box>
  );
}
