const express = require("express");
const router = express.Router();

const salesforceController = require("../controllers/salesforceController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post(
  "/create-account",
  verifyToken,
  salesforceController.createSalesforceAccount
);

module.exports = router;
