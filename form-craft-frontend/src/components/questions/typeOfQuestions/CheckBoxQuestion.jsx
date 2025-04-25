import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { TextField, Button, IconButton } from "@mui/material";
import { FaRegTrashAlt } from "react-icons/fa";

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

  // প্রশ্ন ডিলিট করুন
  const removeQuestion = (qIndex) => {
    const filteredQuestions = questions.filter((_, index) => index !== qIndex);
    setQuestions(filteredQuestions);
  };

  // অপশন ডিলিট করুন
  const removeOption = (qIndex, oIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options = updatedQuestions[qIndex].options.filter(
      (_, index) => index !== oIndex
    );
    setQuestions(updatedQuestions);
  };

  return (
    <div className="my-4 space-y-6">
      {questions.map((question, qIndex) => (
        <div key={qIndex} className="space-y-4 border p-3 rounded-md">
          <div className="flex items-center gap-2">
            <TextField
              {...register(`checkboxQ${qIndex + 1}.question`)}
              label={`Checkbox Question ${qIndex + 1}`}
            />

            <IconButton
              size="medium"
              color="error"
              type="button"
              onClick={() => removeQuestion(qIndex)}
            >
              <FaRegTrashAlt />
            </IconButton>
          </div>

          {question.options.map((_, oIndex) => (
            <div key={oIndex} className="ml-4 flex items-center gap-2">
              <TextField
                {...register(`checkboxQ${qIndex + 1}.option${oIndex + 1}`)}
                label={`Option ${oIndex + 1}`}
              />
              <IconButton
                size="small"
                type="button"
                color="error"
                onClick={() => removeOption(qIndex, oIndex)}
              >
                <FaRegTrashAlt />
              </IconButton>
            </div>
          ))}

          {question.options.length < maxOptions && (
            <button
              type="button"
              onClick={() => addOption(qIndex)}
              className="bg-purple-600 btn btn-sm text-white"
            >
              + Add option
            </button>
          )}
        </div>
      ))}

      {questions.length < maxQuestions && (
        <button className="btn btn-outline" type="button" onClick={addQuestion}>
          + Add checkbox Q.
        </button>
      )}
    </div>
  );
};

export default CheckBoxQuestion;
