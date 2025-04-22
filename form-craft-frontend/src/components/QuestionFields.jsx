import { Box, Checkbox, TextField } from "@mui/material";

const QuestionFields = () => {
  return (
    <Box>
      <TextField label="Short answer"  />
      <TextField label="Paragraph"  />
      <TextField label="Positive integer"  />
      <Checkbox label="Checkbox"  />
    </Box>
  );
};

export default QuestionFields;
