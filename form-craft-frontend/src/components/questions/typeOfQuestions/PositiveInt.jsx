import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";

const PositiveInt = () => {
  const { register } = useFormContext();

  const [questionCount, setQuestionCount] = useState(0);
  const maxQuestions = 4;

  const handleAddPositiveInt = () => {
    if (questionCount < maxQuestions) {
      setQuestionCount((prevCount) => prevCount + 1);
    }
  };

  return (
    <div className="my-4">
      {Array.from({ length: questionCount }, (_, index) => (
        <div key={index}>
          <TextField
            {...register(`positiveInt${index + 1}`, { valueAsNumber: true })}
            label={`Numeric value${index + 1}`}
            defaultValue=""
            type="number"
            inputProps={{
              min: 1,
              step: 1,
            }}
            margin="normal"
          />
        </div>
      ))}

      {questionCount < maxQuestions && (
        <Button
          title="Add numeric value question"
          variant="contained"
          type="button"
          onClick={handleAddPositiveInt}
        >
          Add numeric question
        </Button>
      )}
    </div>
  );
};

export default PositiveInt;
