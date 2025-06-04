const prisma = require("../db");

// Post topics
exports.createTopic = async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ message: "Topic name is required." });
  }

  if (name.length > 20) {
    return res
      .status(400)
      .json({ message: "Topic name cannot exceed 20 characters." });
  }

  try {
    const newTopic = await prisma.topic.create({
      data: {
        name: name.trim(),
      },
    });
    res
      .status(201)
      .json({ message: "Topic created successfully.", topic: newTopic });
  } catch (err) {
    if (err.code === "P2002") {
      return res
        .status(409)
        .json({ message: "Topic with this name is already exists." });
    }
    console.error("Error creating topic:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// GET all topics
exports.getTopics = async (req, res) => {
  try {
    const topics = await prisma.topic.findMany();
    res.status(200).json(topics);
  } catch (err) {
    console.error("Error fetching topics:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};
