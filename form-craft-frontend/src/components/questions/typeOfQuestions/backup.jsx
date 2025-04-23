import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import { useFormContext } from "react-hook-form";

const DynamicShortQuestions = () => {
  const { register } = useFormContext();
  const [questionCount, setQuestionCount] = useState(1);
  const maxQuestions = 4;

  const handleAddQuestion = () => {
    if (questionCount < maxQuestions) {
      setQuestionCount((prevCount) => prevCount + 1);
    }
  };

  return (
    <div>
      {Array.from({ length: questionCount }, (_, index) => (
        <div key={index}>
          <TextField
            {...register(`shortQ${index + 1}`)}
            label={`Short Question ${index + 1}`}
            fullWidth
            margin="normal"
          />
        </div>
      ))}
      {questionCount < maxQuestions && (
        <Button onClick={handleAddQuestion} variant="contained" color="primary">
          Add Question
        </Button>
      )}
      {questionCount >= maxQuestions && (
        <p>You have reached the maximum number of questions (4).</p>
      )}
    </div>
  );
};

export default DynamicShortQuestions;
