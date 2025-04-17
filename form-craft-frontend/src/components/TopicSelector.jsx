import { Autocomplete, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

const TopicSelector = () => {
  const { control } = useFormContext();
  const predefinedTopics = ["Education", "Quiz", "Job", "Other"];

  return (
    <div className="my-4">
      <Controller
        name="topic"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <Autocomplete
            {...field}
            options={predefinedTopics}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select topic"
                variant="outlined"
                required
              />
            )}
            onChange={(_, data) => field.onChange(data)}
          />
        )}
      />
    </div>
  );
};

export default TopicSelector;
