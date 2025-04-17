import { TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import MDEditor from "@uiw/react-md-editor";
import { useTheme } from "../providers/ThemeProvider";
const TitleDescriptionSection = () => {
  const { control } = useFormContext();
  const { isDark } = useTheme();
  return (
    <div className="space-y-4">
      {/* টাইটেল ফিল্ড (MUI + React Hook Form) */}
      <Controller
        name="title"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label={<span className="dark:text-gray-300">Template title</span>}
            variant="standard"
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
          render={({ field }) => (
            <MDEditor
              data-color-mode={isDark ? "dark" : "light"}
              value={field.value}
              onChange={field.onChange}
              height={200}
            />
          )}
        />
      </div>
    </div>
  );
};

export default TitleDescriptionSection;
