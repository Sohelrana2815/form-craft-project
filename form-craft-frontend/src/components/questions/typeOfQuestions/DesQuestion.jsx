import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
const DesQuestion = () => {
  const { register } = useFormContext();

  const [questionCount, setQuestionCount] = useState();

  const maxQuestions = 4;

  const handleAddDesQ = () => {
    if (questionCount < maxQuestions) {
      setQuestionCount((prevCount) => prevCount + 1);
    }
  };

  return (
    <div>
      {Array.from({ length: questionCount }, (_, index) => (
        <div key={index}>
          <TextField
            {...register(`desQ${index + 1}`)}
            label={`Paragraph ${index + 1}`}
            margin="normal"
          />
        </div>
      ))}

      {questionCount < maxQuestions && (
        <Button
          title="Add describable question"
          type="button"
          className="btn btn-sm rounded-full btn-info"
          onClick={handleAddDesQ}
        >
          +
        </Button>
      )}
    </div>
  );
};

export default DesQuestion;
