import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const QUESTION_TYPES = [
  { value: "SHORT_TEXT", label: "Short Text" },
  { value: "LONG_TEXT", label: "Long Text" },
  { value: "INTEGER", label: "Integer" },
  { value: "CHOICE", label: "Multiple Choice" },
];

export default function QuestionsManager() {
  const [questions, setQuestions] = useState([]);

  // Add a new blank question
  const addQuestion = () => {
    setQuestions((qs) => [...qs, { type: "", text: "", options: [] }]);
  };

  // Remove one
  const removeQuestion = (idx) => {
    setQuestions((qs) => qs.filter((_, i) => i !== idx));
  };

  // Update a field on question i
  const updateQuestion = (idx, data) => {
    setQuestions((qs) => {
      const copy = [...qs];
      copy[idx] = { ...copy[idx], ...data };
      return copy;
    });
  };

  return (
    <Box sx={{ mt: 2 }}>
      {questions.map((q, i) => (
        <Box
          key={i}
          sx={{ mb: 2, p: 2, border: "1px solid #ccc", borderRadius: 1 }}
        >
          <Stack direction="row" spacing={1} alignItems="center" mb={2}>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Type</InputLabel>
              <Select
                label="Type"
                value={q.type}
                onChange={(e) =>
                  updateQuestion(i, {
                    type: e.target.value,
                    text: "",
                    options: [],
                  })
                }
              >
                {QUESTION_TYPES.map((t) => (
                  <MenuItem key={t.value} value={t.value}>
                    {t.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <IconButton color="error" onClick={() => removeQuestion(i)}>
              <DeleteIcon />
            </IconButton>
          </Stack>

          {/* Once a type is chosen… */}
          {q.type && (
            <Box
              sx={{ ml: 2, display: "flex", flexDirection: "column", gap: 2 }}
            >
              {/* Question text field */}
              <TextField
                label="Question"
                value={q.text}
                onChange={(e) => updateQuestion(i, { text: e.target.value })}
                fullWidth
                size="small"
              />

              {/* If Choice type, render options */}
              {q.type === "CHOICE" && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {q.options.map((opt, j) => (
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      key={j}
                    >
                      <TextField
                        label={`Option ${j + 1}`}
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...q.options];
                          newOpts[j] = e.target.value;
                          updateQuestion(i, { options: newOpts });
                        }}
                        size="small"
                        fullWidth
                      />
                      <IconButton
                        color="error"
                        onClick={() => {
                          const newOpts = q.options.filter((_, x) => x !== j);
                          updateQuestion(i, { options: newOpts });
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  ))}

                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      if (q.options.length < 4) {
                        updateQuestion(i, { options: [...q.options, ""] });
                      }
                    }}
                    disabled={q.options.length >= 4}
                  >
                    Add Option
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </Box>
      ))}

      <Button
        variant="contained"
        onClick={addQuestion}
        disabled={questions.length >= 4}
      >
        Add Question
      </Button>

      {questions.length >= 4 && (
        <Typography color="error" variant="caption" sx={{ mt: 1, ml: 2 }}>
          You can only add up to 4 questions.
        </Typography>
      )}
    </Box>
  );
}
