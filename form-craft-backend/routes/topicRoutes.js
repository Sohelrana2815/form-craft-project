const express = require("express");
const router = express.Router();

const topicController = require("../controllers/topicController");

router.post("/topics", topicController.createTopic);
router.get("/topics", topicController.getTopics);

module.exports = router;
