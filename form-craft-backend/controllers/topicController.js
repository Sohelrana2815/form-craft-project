const prisma = require("../db");

exports.getTopics = async (req, res) => {
  try {
    const topics = await prisma.topic.findMany();
    res.json(topics);
  } catch (error) {
    console.error("Error getting topic", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
