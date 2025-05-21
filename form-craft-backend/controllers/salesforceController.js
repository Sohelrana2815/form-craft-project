const { URLSearchParams } = require("url");
const axios = require("axios");
exports.createSalesforceAccount = async (req, res) => {
  try {
    const { companyName, phone, displayName } = req.body;

    const user = req.user; // from jwt token
    // Build and send the OAuth token request
    const params = new URLSearchParams({
      grant_type: "password",
      client_id: process.env.SALESFORCE_CONSUMER_KEY || "",
      client_secret: process.env.SALESFORCE_CONSUMER_SECRET || "",
      username: process.env.SALESFORCE_USERNAME || "",
      // Make sure this var really is "password+token"
      password:
        (process.env.SALESFORCE_PASSWORD ?? "") +
        (process.env.SALESFORCE_SECURITY_TOKEN ?? ""),
    });
    console.log(params.toString());
    console.log(
      "Final password string:",
      process.env.SALESFORCE_PASSWORD + process.env.SALESFORCE_SECURITY_TOKEN
    );

    // // 1. Salesforce Authentication (OAuth2 password flow)
    const authResponse = await axios.post(
      "https://login.salesforce.com/services/oauth2/token",
      params,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    console.log("Got token:", authResponse.data.access_token);

    const { access_token, instance_url } = authResponse.data;

    // Create Account
    const accountRes = await axios.post(
      `${instance_url}/services/data/v58.0/sobjects/Account`,
      { Name: companyName, Phone: phone },
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    // Create Contact
    await axios.post(
      `${instance_url}/services/data/v58.0/sobjects/Contact`,
      {
        LastName: displayName || "Unknown",
        Email: user.email,
        AccountId: accountRes.data.id,
      },
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    res.json({ success: true, accountId: accountRes.data.id });
  } catch (error) {
    console.error(
      "Salesforce Error Details:",
      error.response?.data,
      "Status Code:",
      error.response?.status
    );
    res.status(500).json({ error: "Salesforce Integration Failed" });
  }
};
