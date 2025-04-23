import { Box, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

const QuestionFields = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const rows = [1, 2, 3, 4]; // Array index
  return (
    <Box>
      {rows.map((i) => (
        <Box
          key={i}
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
          gap={2}
        >
          {/* Short Answer */}
          <Box className="block md:hidden">
            <strong>Q. Set {rows[i - 1]}</strong>
          </Box>
          <Controller
            name={`shortAnswer${i}`}
            defaultValue=""
            control={control}
            rules={{ required: "At least one question is required." }}
            render={({ field }) => (
              <TextField {...field} label="Short answer" margin="normal" />
            )}
          />
          {errors.shortAnser && <span>{errors.shortAnser.message}</span>}
          {/* Paragraph */}
          <Controller
            name={`paragraph${i}`}
            defaultValue=""
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Paragraph"
                multiline
                rows={2}
                margin="normal"
              />
            )}
          />
          {/* Positive Integer */}
          <Controller
            name={`positiveInt${i}`}
            defaultValue={0}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Positive integer"
                type="number"
                inputProps={{ min: 1, step: 1 }}
                margin="normal"
              />
            )}
          />
          {/* Checkbox */}
          <Controller
            name={`checkbox${i}`}
            defaultValue={false}
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} checked={field.value} />}
                label="Checkbox"
                sx={{ marginY: "8px" }}
              />
            )}
          />
        </Box>
      ))}
    </Box>
  );
};

export default QuestionFields;
