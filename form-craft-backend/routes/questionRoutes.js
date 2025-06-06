const express = require("express");

const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const questionController = require("../controllers/questionController");
router.post(
  "/:templateId/questions",
  verifyToken,
  questionController.createQuestions
);

module.exports = router;
