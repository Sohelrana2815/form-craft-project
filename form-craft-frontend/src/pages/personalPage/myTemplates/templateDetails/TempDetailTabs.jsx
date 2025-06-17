import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router";
import TemplateSettings from "./TemplateSettings";
import EditTemplate from "./EditTemplate";
import Results from "./Results";
import TemplateAnalytics from "./TemplateAnalytics";

const TempDetailTabs = () => {
  const { templateId } = useParams();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
  };

  // Data

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {/* {templateData.title} */} TempID: {templateId}
      </Typography>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="General Settings" />
        <Tab label="Edit Template" />
        <Tab label="Results" />
        <Tab label="Template Analytics" />
      </Tabs>

      <Box sx={{ p: 2 }}>
        {activeTab === 0 && (
          <div>
            <Typography variant="h6" gutterBottom>
              <TemplateSettings />
            </Typography>
          </div>
        )}
        {/* Edit Template */}
        {activeTab === 1 && (
          <div>
            <Typography variant="h6" gutterBottom>
              <EditTemplate />
            </Typography>
            {/* Add your template editor here */}
          </div>
        )}
        {/* Results */}
        {activeTab === 2 && (
          <div>
            <Typography variant="h6" gutterBottom>
              <Results />
            </Typography>
            {/* Add results display here */}
          </div>
        )}
        {/* Template Analytics */}
        {activeTab === 3 && (
          <div>
            <Typography variant="h6" gutterBottom>
              <TemplateAnalytics />
            </Typography>
            {/* Add analytics charts here */}
          </div>
        )}
      </Box>
    </Box>
  );
};

export default TempDetailTabs;
