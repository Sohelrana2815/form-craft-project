const express = require("express");
const router = express.Router();
// const { verifyToken } = require("../middleware/authMiddleware");

const templateController = require("../controllers/templateController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/templates", verifyToken, templateController.createTemplate);
router.get("/templates", templateController.getTemplates);
router.get("/templates/:id", templateController.getTemplateById);
module.exports = router;
