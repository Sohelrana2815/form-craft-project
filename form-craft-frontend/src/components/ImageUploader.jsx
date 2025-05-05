import { Box } from "@mui/material";
import { useFormContext } from "react-hook-form";

const ImageUploader = () => {
  const { register } = useFormContext();

  return (
    <Box className="my-4">
      <input
        type="file"
        className="file-input file-input-primary dark:bg-neutral"
        accept="image/*"
        {...register("image")}
      />
      <span className="ml-4">(Optional)</span>
    </Box>
  );
};

export default ImageUploader;
