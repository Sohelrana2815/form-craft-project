const axios = require("axios");

exports.createSalesforceAccount = async (req, res) => {
  try {
    const { companyName, phone } = req.body;
    console.log(companyName, phone);
  } catch (error) {
    console.error("Salesforce Error:", error.response?.data);
    res.status(500).json({ error: "Salesforce Integration Failed" });
  }
};
