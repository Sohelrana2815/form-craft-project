import { Box, Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
const ImageUploader = () => {
  return (
    <Box className="my-4">
      {/* File input */}
      <input
        type="file"
        accept="image/*"
        id="image-upload"
        style={{ display: "none" }}
      />
      {/* Custom button  */}
      <label htmlFor="image-upload">
        <Button
          variant="outlined"
          component="span"
          startIcon={<CloudUploadIcon />}
        >
          Upload image
        </Button>
      </label>

      {/* Preview section */}
      <Box className="border p-8 rounded-md text-center my-4">
        <p className="text-gray-500">Image show here.</p>
      </Box>
    </Box>
  );
};

export default ImageUploader;
