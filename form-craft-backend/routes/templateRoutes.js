const express = require("express");
const router = express.Router();

const templateController = require("../controllers/templateController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/templates", verifyToken, templateController.createTemplate);
router.get("/templates", templateController.getTemplates);
router.get("/templates/public", templateController.getPublicTemplates);
router.get("/templates/mine", verifyToken, templateController.getMyTemplates);
router.get("/template/:id", templateController.getTemplateById);
router.put(
  "/templates/:id/questions",
  verifyToken,
  templateController.updateTemplateQuestions
);
module.exports = router;
