import { Controller, useFormContext } from "react-hook-form";
import { useTheme } from "../providers/ThemeProvider";
import { TextField } from "@mui/material";
import MDEditor from "@uiw/react-md-editor";
// ------------------------------ IMPORT ----------------------------------//
const TitleDescriptionSection = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const { isDark } = useTheme();

  return (
    <div className="space-y-4">
      {/* Title field */}
      <Controller
        name="title"
        control={control}
        defaultValue=""
        rules={{ required: "Title is required" }}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label={<span className="dark:text-gray-300">Template title</span>}
            variant="standard"
            focused={isDark}
            sx={{
              input: {
                color: isDark ? "white" : "black",
              },
            }}
          />
        )}
      />
      {/* Error for title field */}
      {errors.title && (
        <span className="text-red-600">{errors.title.message}</span>
      )}

      {/* Description field (Markdown editor + React hook form) */}

      <div className="my-4">
        <label className="block font-medium text-sm my-2">Description</label>
        <Controller
          name="description"
          control={control}
          defaultValue=""
          rules={{ required: "Description is required" }}
          render={({ field }) => (
            <MDEditor data-color-mode={isDark ? "dark" : "light"} {...field} />
          )}
        />
      </div>
      {errors.description && (
        <span className="text-red-600">{errors.description.message}</span>
      )}
    </div>
  );
};

export default TitleDescriptionSection;
