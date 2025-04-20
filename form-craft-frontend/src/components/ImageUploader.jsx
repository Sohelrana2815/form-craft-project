import { Box, Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
const ImageUploader = () => {
  const { register, watch } = useFormContext();
  const [previewUrl, setPreviewUrl] = useState(null);

  // Watch image file capture
  const imageFiles = watch("image");
  // ফাইল বদলালে প্রিভিউ URL তৈরি করা
  useEffect(() => {
    if (imageFiles && imageFiles.length > 0) {
      const file = imageFiles[0];
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      // cleanup
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [imageFiles]);
  return (
    <Box className="my-4">
      <input
        type="file"
        accept="image/*"
        id="image-upload"
        hidden
        {...register("image", { required: true })}
      />

      <label htmlFor="image-upload">
        <Button
          variant="outlined"
          component="span"
          startIcon={<CloudUploadIcon />}
        >
          Upload image
        </Button>
      </label>

      {/* Preview */}

      <Box className="border p-8 rounded-md text-center my-4">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview"
            style={{ maxWidth: "100%", maxHeight: 200 }}
          />
        ) : (
          <p className="text-gray-500">Image will appear here</p>
        )}
      </Box>
    </Box>
  );
};

export default ImageUploader;
