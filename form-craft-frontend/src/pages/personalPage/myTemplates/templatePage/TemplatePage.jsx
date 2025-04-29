import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import GeneralSettings from "./templateSettings/GeneralSettings";
import EditTemplate from "./templateSettings/EditTemplate";

const TemplatePage = () => {
  const [tabValue, setTabValue] = useState(0);

  return (
    <>
      <Box>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
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
