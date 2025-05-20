const express = require("express");
const router = express.Router();

const salesforceController = require("../controllers/salesforceController");

router.post("/create-account", salesforceController.createSalesforceAccount);

module.exports = router;
