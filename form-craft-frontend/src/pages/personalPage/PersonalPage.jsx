import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import TemplateList from "./myTemplates/TemplateList";
import SubmittedFormsList from "./mySubmittedForms/SubmittedFormsList";

const PersonalPage = () => {
  const [value, setValue] = useState(0);
  return (
    <Box>
      <Tabs value={value} onChange={(e, newValue) => setValue(newValue)}>
        <Tab label="My Templates" />
        <Tab label="My Submitted Forms" />
      </Tabs>
      {value === 0 && <TemplateList />}
      {value === 1 && <SubmittedFormsList />}
    </Box>
  );
};

export default PersonalPage;
