const express = require("express");
const router = express.Router();

const templateController = require("../controllers/templateController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/templates", verifyToken, templateController.createTemplate);
router.get("/templates", verifyToken, templateController.getTemplates);
router.get("/templates/public", templateController.getPublicTemplates);

module.exports = router;
