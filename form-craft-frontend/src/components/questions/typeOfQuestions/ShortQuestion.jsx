import { TextField, Checkbox, FormControlLabel } from "@mui/material";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { FaRegTrashAlt } from "react-icons/fa";
const ShortQuestion = () => {
  const { register } = useFormContext();
  const [questionCount, setQuestionCount] = useState(0);
  const maxQuestions = 4;

  const addQuestion = () => {
    if (questionCount < maxQuestions) {
      setQuestionCount((prev) => prev + 1);
    }
  };

  const removeQuestion = () => {
    if (questionCount <= maxQuestions) {
      setQuestionCount((prev) => prev - 1);
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
          <br />
          <FormControlLabel
            control={
              <Checkbox
                {...register(`showShortQ${index + 1}`)}
                defaultChecked={true}
              />
            }
            label="Show in results"
          />
        </div>
      ))}

      <div className="flex items-center gap-x-4">
        {questionCount < maxQuestions && (
          <button
            className="btn rounded-full"
            type="button"
            onClick={addQuestion}
          >
            + Add short Q .
          </button>
        )}
        {questionCount > 0 && (
          <button
            className="text-red-600"
            type="button"
            onClick={removeQuestion}
          >
            <FaRegTrashAlt />
          </button>
        )}
      </div>
    </div>
  );
};

export default ShortQuestion;
