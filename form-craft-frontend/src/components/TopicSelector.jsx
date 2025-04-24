import { Autocomplete, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

const TopicSelector = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const predefinedTopics = ["Education", "Quiz", "Job", "Other"];

  return (
    <div className="my-4">
      <Controller
        name="topic"
        control={control}
        defaultValue=""
        rules={{ required: "Topic is required" }}
        render={({ field }) => (
          <Autocomplete
            {...field}
            options={predefinedTopics}
            renderInput={(params) => (
              <TextField
                {...params}
                label={<span className="dark:text-gray-300">Topic</span>}
                variant="outlined"
              />
            )}
            onChange={(_, data) => field.onChange(data)}
          />
        )}
      />
      {errors.topic && (
        <span className="text-red-600">{errors.topic.message}</span>
      )}
    </div>
  );
};

export default TopicSelector;
