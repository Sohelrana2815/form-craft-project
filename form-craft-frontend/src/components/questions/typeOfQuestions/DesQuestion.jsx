import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { FaRegTrashAlt } from "react-icons/fa";

const DesQuestion = () => {
  const { register } = useFormContext();

  // শুরুতেই কোনো ফিল্ড দেখাবে না
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
      {/* যতগুলো ফিল্ড অ্যাড করেছেন, সেগুলো রেন্ডার করবে */}
      {Array.from({ length: questionCount }, (_, index) => (
        <div key={index}>
          <TextField
            {...register(`desQ${index + 1}`)}
            label={`Paragraph ${index + 1}`}
            defaultValue=""
            margin="normal"
          />
          <br />
          <FormControlLabel
            control={
              <Checkbox
                {...register(`showDesQ${index + 1}`)}
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
            + Paragraph Q .
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

export default DesQuestion;
