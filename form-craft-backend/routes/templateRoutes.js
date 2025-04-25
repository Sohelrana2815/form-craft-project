const express = require("express");
const router = express.Router();
// const { verifyToken } = require("../middleware/authMiddleware");

const templateController = require("../controllers/templateController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/templates",verifyToken, templateController.createTemplate);
router.get("/templates", templateController.getTemplates);

module.exports = router;
