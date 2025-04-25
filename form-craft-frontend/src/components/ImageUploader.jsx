import { Box } from "@mui/material";
import { useFormContext } from "react-hook-form";

const ImageUploader = () => {
  const { register } = useFormContext();


  return (
    <Box className="my-4">
      <input
        type="file"
        className="file-input file-input-primary"
        accept="image/*"
        {...register("image")}
      />
    </Box>
  );
};

export default ImageUploader;
