import { Box } from "@mui/material";
import { useFormContext } from "react-hook-form";

const ImageUploader = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <Box className="my-4">
      <input
        type="file"
        className="file-input file-input-primary"
        accept="image/*"
        {...register("image", { required: "Image is required" })}
      />
      {errors.image && (
        <span className="text-sm text-red-600 block my-2">{errors.image.message}</span>
      )}
    </Box>
  );
};

export default ImageUploader;
