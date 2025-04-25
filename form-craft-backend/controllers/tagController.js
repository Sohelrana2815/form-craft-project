const prisma = require("../db");

// get all the tags

exports.getTags = async (req, res) => {
  try {
    const tags = await prisma.tag.findMany();
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tags" });
  }
};

// New tag add

exports.createTag = async (req, res) => {
  const { name } = req.body;

  if (!name) return res.status(404).json({ error: "Tag name required" });

  try {
    const newTag = await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    res.json(newTag);
  } catch (error) {
    res.status(500).json({ error: "Failed to create tag" });
  }
};
