const express = require("express");
const router = express.Router();

const templateController = require("../controllers/templateController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/templates", verifyToken, templateController.createTemplate);

module.exports = router;
