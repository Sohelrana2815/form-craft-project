import { useFormContext } from "react-hook-form";
const QuestionFields = () => {
  const { register } = useFormContext();

  const questionTypes = [
    { type: "singleLine", label: "Short answer" },
    { type: "multiLine", label: "Paragraph" },
    { type: "integer", label: "integer" },
    { type: "checkbox", label: "Checkbox" },
  ];




  





};

export default QuestionFields;
