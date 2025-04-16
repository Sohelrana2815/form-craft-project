import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import GeneralSettings from "./templateSettings/GeneralSettings";
import ResultsTable from "./templateSettings/ResultsTable";
import AggregationCharts from "./templateSettings/AggregationCharts";

const TemplateDetailPage = () => {
  const [tabValue, setTabValue] = useState(0);
  return (
    <Box>
      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
        <Tab label="General Settings" />
        <Tab label="Results" />
        <Tab label="Aggregations" />
      </Tabs>
      {tabValue === 0 && <GeneralSettings />}
      {tabValue === 1 && <ResultsTable />}
      {tabValue === 2 && <AggregationCharts />}
    </Box>
  );
};

export default TemplateDetailPage;
