const { URLSearchParams } = require("url");
const axios = require("axios");

const TOKEN_URL = "https://login.salesforce.com/services/oauth2/token";
const API_VERSION = "v58.0";

exports.createSalesforceAccount = async (req, res) => {
  try {
    const { companyName, phone, displayName } = req.body;

    const { email } = req.body; // from jwt token

    console.log(
      `companyName: ${companyName}, phone: ${phone} and displayName: ${displayName}`
    );

    const params = new URLSearchParams({
      grant_type: "password",
      client_id: process.env.SALESFORCE_CONSUMER_KEY,
      client_secret: process.env.SALESFORCE_CONSUMER_SECRET,
      username: process.env.SALESFORCE_USERNAME,
      // PASS + SECURITY TOKEN
      password: process.env.SALESFORCE_PASSWORD,
    });

    console.log(params.toString());

    const authRes = await axios.post(TOKEN_URL, params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    console.log(authRes.data);
  } catch (err) {
    console.error("SF Integration Error:", err.response?.data || err.message);
    return res.status(500).json({ error: "Salesforce integration failed" });
  }
};
