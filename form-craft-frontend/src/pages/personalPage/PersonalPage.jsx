import { Box, Tab, Tabs } from "@mui/material";
import TemplateList from "./myTemplates/TemplateList";
import SubmittedFormsList from "./mySubmittedForms/SubmittedFormsList";
import { useState } from "react";

import { useTheme } from "../../providers/ThemeProvider";

const PersonalPage = () => {
  const { isDark } = useTheme();
  const [value, setValue] = useState(0);
  return (
    <Box>
      <Tabs
        className="my-6"
        value={value}
        onChange={(e, newValue) => setValue(newValue)}
        sx={{
          // Inactive tabs
          "& .MuiTab-root": {
            color: isDark ? "rgba(255,255,255,0.7)" : undefined,
          },
          // Active tab label + indicator
          "& .Mui-selected": {
            color: isDark ? "#fff" : undefined,
          },
          "& .MuiTabs-indicator": {
            backgroundColor: isDark ? "#fff" : undefined,
          },
        }}
      >
        <Tab label="My Templates" />
        <Tab label="My Submitted Forms" />
      </Tabs>
      {value === 0 && <TemplateList />}
      {value === 1 && <SubmittedFormsList />}
    </Box>
  );
};

export default PersonalPage;
