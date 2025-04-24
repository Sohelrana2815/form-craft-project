import { Box } from "@mui/material";
import ShortQuestion from "./typeOfQuestions/ShortQuestion";
import DesQuestion from "./typeOfQuestions/DesQuestion";
import PositiveInt from "./typeOfQuestions/PositiveInt";
import CheckBoxQuestion from "./typeOfQuestions/CheckBoxQuestion";

const QuestionSets = () => {
  return (
    <Box className="flex flex-col md:flex-row justify-evenly">
      <ShortQuestion />
      <DesQuestion />
      <PositiveInt />
      <CheckBoxQuestion />
    </Box>
  );
};

export default QuestionSets;
