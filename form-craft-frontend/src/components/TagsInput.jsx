import { Autocomplete, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

const TagsInput = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  // Some predefine tags but fetch form DB

  const predefinedTags = ["Survey", "Feedback", "JavaScript", "React", "C#","Graphic"];

  return (
    <div className="my-4">
      <Controller
        name="tags"
        control={control}
        defaultValue={[]}
        rules={{ required: "Tags is required" }}
        render={({ field }) => (
          <Autocomplete
            {...field}
            multiple
            freeSolo
            options={predefinedTags}
            className="w-full md:w-1/4"
            renderInput={(params) => (
              <TextField
                {...params}
                label={<span className="dark:text-gray-300">Tag(s)</span>}
                variant="outlined"
                placeholder="Select tag(s)"
              />
            )}
            onChange={(_, data) => field.onChange(data)}
          />
        )}
      />
      {errors.tags && (
        <span className="text-red-600">{errors.tags.message}</span>
      )}
    </div>
  );
};

export default TagsInput;
