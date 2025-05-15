import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router";
const CreateTemBtn = () => {
  return (
    <Box className="flex justify-center items-center md:flex md:justify-start">
      <Link to="create-template">
        <Button type="button" variant="contained">
          <AddIcon />
          <p className="hidden md:block">New Template</p>
        </Button>
      </Link>
    </Box>
  );
};

export default CreateTemBtn;
