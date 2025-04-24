import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { TextField, Button } from "@mui/material";

const CheckBoxQuestion = () => {
  const { register } = useFormContext();
  const [questions, setQuestions] = useState([]);
  const maxQuestions = 4;
  const maxOptions = 4;

  // নতুন চেকবক্স প্রশ্ন যোগ
  const addQuestion = () => {
    if (questions.length < maxQuestions) {
      setQuestions([...questions, { options: [] }]);
    }
  };

  // নির্দিষ্ট প্রশ্নে অপশন যোগ
  const addOption = (qIndex) => {
    if (questions[qIndex].options.length < maxOptions) {
      const updatedQuestions = [...questions];
      updatedQuestions[qIndex].options.push("");
      setQuestions(updatedQuestions);
    }
  };

  return (
    <div className="my-4 space-y-6">
      {questions.map((question, qIndex) => (
        <div key={qIndex} className="space-y-4">
          {/* প্রশ্নের ইনপুট ফিল্ড */}
          <TextField
            {...register(`checkboxQ${qIndex + 1}.question`)}
            label={`Checkbox Question ${qIndex + 1}`}
            fullWidth
            margin="normal"
          />

          {/* অপশনগুলোর জন্য ফিল্ড */}
          {question.options.map((_, oIndex) => (
            <div key={oIndex} className="ml-4">
              <TextField
                {...register(`checkboxQ${qIndex + 1}.option${oIndex + 1}`)}
                label={`Option ${oIndex + 1}`}
                fullWidth
                margin="normal"
              />
            </div>
          ))}

          {/* অপশন যোগ বাটন (সর্বোচ্চ ৪টি) */}
          {question.options.length < maxOptions && (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => addOption(qIndex)}
              className="ml-4"
            >
              Add Option
            </Button>
          )}
        </div>
      ))}

      {/* নতুন প্রশ্ন যোগ বাটন (সর্বোচ্চ ৪টি) */}
      {questions.length < maxQuestions && (
        <Button variant="contained" color="primary" onClick={addQuestion}>
          Add Checkbox Question
        </Button>
      )}
    </div>
  );
};

export default CheckBoxQuestion;
