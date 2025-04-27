import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router";
const CreateTemBtn = () => {
  return (
    <Box className="p-4">
      <Link to="create-template">
        <Button type="button" variant="outlined" startIcon={<AddIcon />}>
          Create a template
        </Button>
      </Link>
    </Box>
  );
};

export default CreateTemBtn;
