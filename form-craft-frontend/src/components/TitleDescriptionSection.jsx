import { TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import MDEditor from "@uiw/react-md-editor";
import { useTheme } from "../providers/ThemeProvider";
const TitleDescriptionSection = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const { isDark } = useTheme();
  return (
    <div className="space-y-4">
      <Controller
        name="title"
        control={control}
        defaultValue=""
        rules={{ required: "Title is required" }}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            error={!!error}
            helperText={error?.message}
            fullWidth
            label={<span className="dark:text-gray-300 ">Template title</span>}
            variant="standard"
            InputProps={{
              style: {
                color: isDark ? "#e0e0e0" : "#000000",
              },
            }}
          />
        )}
      />

      {/* Description field (Markdown Editor + React hook form) */}
      <div className="mt-4">
        <label className="block text-sm font-medium mb-2">Description</label>
        <Controller
          name="description"
          control={control}
          defaultValue=""
          rules={{ required: "Description is required" }}
          render={({ field }) => (
            <MDEditor
              data-color-mode={isDark ? "dark" : "light"}
              value={field.value}
              onChange={field.onChange}
              height={200}
            />
          )}
        />

        {errors.description && (
          <span className="text-red-600">{errors.description.message}</span>
        )}
      </div>
    </div>
  );
};

export default TitleDescriptionSection;
