import { Box, Tab, Tabs } from "@mui/material";
import TemplateList from "./myTemplates/TemplateList";
import SubmittedFormsList from "./mySubmittedForms/SubmittedFormsList";
import { useState } from "react";

const PersonalPage = () => {
  const [value, setValue] = useState(0);
  return (
    <Box>
      <Tabs value={value} onChange={(e, newValue) => setValue(newValue)}>
        <Tab label="My Templates" />
        <Tab label="My Submitted Forms" />
      </Tabs>
      {value === 0 && <TemplateList />} {/* DataGrid here  */}
      {value === 1 && <SubmittedFormsList />} {/* DataGrid here */}
    </Box>
  );
};

export default PersonalPage;
