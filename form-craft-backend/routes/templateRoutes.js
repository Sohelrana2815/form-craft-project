const express = require("express");
const router = express.Router();

const templateController = require("../controllers/templateController");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/templates", templateController.getTemplates);
router.post("/templates", verifyToken, templateController.createTemplate);
router.get(
  "/templates/my-templates",
  verifyToken,
  templateController.getMyTemplates
);
router.get("/templates/:id", templateController.getTemplateById);

router.patch("/templates/:id", templateController.updateTemplate);

router.post(
  "/templates/:templateId/comments",
  verifyToken,
  templateController.addComment
);

router.get(
  "/templates/:templateId/comments",
  templateController.getCommentsByTemplateId
);

router.post(
  "/templates/:templateId/likes",
  verifyToken,
  templateController.addLike
);

module.exports = router;
