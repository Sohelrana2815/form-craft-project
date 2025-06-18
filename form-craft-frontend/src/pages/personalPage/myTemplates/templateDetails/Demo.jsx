import { useFieldArray } from "react-hook-form";
import { Box, TextField, Button } from "@mui/material";
import { FiMinusCircle } from "react-icons/fi";

const OptionsFieldArray = ({ control, index }) => {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `questions.${index}.options`,
  });

  return (
    <Box sx={{ mt: 2 }}>
      {fields.map((field, optIdx) => (
        <Box key={field.id} display="flex" alignItems="center" mb={1}>
          <TextField
            size="small"
            fullWidth
            defaultValue={field.value}
            {...register(`questions.${index}.options.${optIdx}`)}
          />
          <Button color="error" sx={{ ml: 1 }} onClick={() => remove(optIdx)}>
            <FiMinusCircle />
          </Button>
        </Box>
      ))}
      <Button variant="outlined" sx={{ mt: 1 }} onClick={() => append("")}>
        Add Option
      </Button>
    </Box>
  );
};

export default OptionsFieldArray;