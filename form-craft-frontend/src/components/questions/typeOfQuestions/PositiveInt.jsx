import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { FaRegTrashAlt } from "react-icons/fa";
import { useTheme } from "../../../providers/ThemeProvider";

const PositiveInt = () => {
  const { register } = useFormContext();
  const { isDark } = useTheme();
  const [questionCount, setQuestionCount] = useState(0);
  const maxQuestions = 4;

  const addQuestion = () => {
    if (questionCount < maxQuestions) {
      setQuestionCount((prevCount) => prevCount + 1);
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
            {...register(`positiveInt${index + 1}`)}
            label={`Number type Q${index + 1}`}
            defaultValue=""
            margin="normal"
            sx={{
              /* label */
              "& .MuiInputLabel-root": {
                color: isDark ? "white" : "black",
              },
              /* the textarea*/
              "& .MuiOutlinedInput-input": {
                color: isDark ? "white" : "black",
              },

              /* the outline itself */
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: isDark ? "white" : "black",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: isDark ? "white" : "black",
              },
            }}
          />
          <br />
          <FormControlLabel
            control={
              <Checkbox
                {...register(`showPositiveIntQ${index + 1}`)}
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
            className="btn rounded-full dark:btn-primary"
            type="button"
            onClick={addQuestion}
          >
            + Numeric value Q .
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

export default PositiveInt;
