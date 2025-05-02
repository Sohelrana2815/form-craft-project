import { TextField, Checkbox, FormControlLabel } from "@mui/material";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { FaRegTrashAlt } from "react-icons/fa";
import { useTheme } from "../../../providers/ThemeProvider";
const ShortQuestion = () => {
  const { isDark } = useTheme();
  const { register } = useFormContext();
  const [questionCount, setQuestionCount] = useState(1);
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
            focused={isDark}
            sx={{
              
            }}
          />
          <br />
          <FormControlLabel
            control={
              <Checkbox
                {...register(`showShortQ${index + 1}`)}
                defaultChecked={true}
                sx={{
                  color: isDark
                    ? "rgba(255,255,255,0.7)" // unchecked color
                    : undefined,
                  "&.Mui-checked": {
                    color: isDark
                      ? "rgba(255,255,255,1)" // checked color
                      : undefined,
                  },
                }}
              />
            }
            label="Show in results"
          />
        </div>
      ))}

      <div className="flex items-center gap-x-4">
        {questionCount < maxQuestions && (
          <button
            className="btn rounded-full dark:btn-primary"
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
