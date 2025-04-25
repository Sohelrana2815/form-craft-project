const express = require("express");
const router = express.Router();

const templateController = require("../controllers/templateController");

router.post("/templates", templateController.createTemplate);
router.get("/templates", templateController.getTemplates);

module.exports = router;
