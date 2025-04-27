const express = require("express");
const router = express.Router();

const templateController = require("../controllers/templateController");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/templates", templateController.getTemplates);
router.post("/templates", verifyToken, templateController.createTemplate);
router.get("/templates/:id", templateController.getTemplateById);

router.get(
  "/templates/my-templates",
  verifyToken,
  templateController.getMyTemplates
);

module.exports = router;
