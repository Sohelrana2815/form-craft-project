const prisma = require("../db");

exports.createTag = async (req, res) => {
  const { names } = req.body; // ARRAY OF STRING

  if (!names || !Array.isArray(names) || names.length === 0) {
    return res
      .status(400)
      .json({ message: "An array of tag names is required." });
  }

  // Validate each tag name in the array

  const invalidNames = names.filter((name) => {
    return !name || name.trim() === "" || name.length > 20;
  });

  if (invalidNames.length > 0) {
    return res.status(400).json({
      message: "Some tag names are invalid (empty, too long or not strings).",
      invalidNames: invalidNames,
    });
  }

  try {
    const tagsToCreate = names.map((name) => ({ name: name.trim() }));
    const result = await prisma.tag.createMany({
      data: tagsToCreate,
      skipDuplicates: true,
    });

    if (result.count === 0) {
      return res.status(200).json({
        message:
          "No new tags were created. All provided tags might already exist.",
        count: result.count,
      });
    }
    res.status(201).json({
      message: `${result.count} tags created or updated successfully.`,
      createdCount: result.count,
    });
  } catch (err) {
    console.error("Error creating tags:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// get all the tags

exports.getTags = async (req, res) => {
  try {
    const tags = await prisma.tag.findMany();
    res.status(200).json(tags);
  } catch (error) {
    console.error("Error fetching topics:", err);
    res.status(500).json({ error: "Failed to fetch tags" });
  }
};
