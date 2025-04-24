import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

const ShortQuestion = () => {
  const { register } = useFormContext();
  const [questionCount, setQuestionCount] = useState(0);
  const maxQuestions = 4;

  const handleAddShortQ = () => {
    if (questionCount < maxQuestions) {
      setQuestionCount((prevCount) => prevCount + 1);
    }
  };

  return (
    <div className="my-4">
      {Array.from({ length: questionCount }, (_, index) => (
        <div key={index}>
          <TextField
            {...register(`shortQ${index + 1}`)}
            label={`Short question ${index + 1}`}
            defaultValue=""
            margin="normal"
          />
        </div>
      ))}

      {questionCount < maxQuestions && (
        <Button
          title="Add short question"
          variant="contained"
          type="button"
          onClick={handleAddShortQ}
        >
          Add short question
        </Button>
      )}

      {questionCount >= maxQuestions && (
        <p className="text-red-600 text-sm">
          You have reached the maximum number of short questions (4).
        </p>
      )}
    </div>
  );
};

export default ShortQuestion;
