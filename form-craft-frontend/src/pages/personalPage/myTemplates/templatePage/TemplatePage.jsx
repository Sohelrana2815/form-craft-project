import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import GeneralSettings from "./templateSettings/GeneralSettings";
import EditTemplate from "./templateSettings/EditTemplate";
import { useTheme } from "../../../../providers/ThemeProvider";

const TemplatePage = () => {
  const { isDark } = useTheme();
  const [tabValue, setTabValue] = useState(0);

  return (
    <>
      <Box>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
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
          <Tab label="General Settings" />
          <Tab label="Edit Template" />
          <Tab label="Results" />
          <Tab label="Aggregation" />
        </Tabs>

        {tabValue === 0 && <GeneralSettings />}
        {tabValue === 1 && <EditTemplate />}
        {tabValue === 2 && <p>Results</p>}
        {tabValue === 3 && <p>Aggregation</p>}
      </Box>
    </>
  );
};

export default TemplatePage;
