import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

const DesQuestion = () => {
  const { register } = useFormContext();

  // শুরুতেই কোনো ফিল্ড দেখাবে না
  const [questionCount, setQuestionCount] = useState(0);
  const maxQuestions = 4;

  const handleAddDesQ = () => {
    if (questionCount < maxQuestions) {
      setQuestionCount((prev) => prev + 1);
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
            multiline
            rows={4}
            defaultValue=""
            className="w-full md:w-[400px]"
            margin="normal"
          />
        </div>
      ))}

      {/* ৪ টার কম হলে বাটন দেখাবে */}
      {questionCount < maxQuestions && (
        <Button variant="contained" type="button" onClick={handleAddDesQ}>
          Add describable question
        </Button>
      )}
    </div>
  );
};

export default DesQuestion;
