import { Tabs, Tab, Box } from "@mui/material";
import { useState } from "react";
import MyTemplates from "./myTemplates/MyTemplates";
import MyFilledForms from "./myFilledForms/MyFilledForms";

const PersonalPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div className="m-4">
      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tab label="My Templates" />
        <Tab label="My Filled Form" />
      </Tabs>

      <Box sx={{ p: 3 }}>
        {activeTab === 0 && <MyTemplates />}
        {activeTab === 1 && <MyFilledForms />}
      </Box>
    </div>
  );
};

export default PersonalPage;
