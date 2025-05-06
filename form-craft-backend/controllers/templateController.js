const prisma = require("../db");
exports.createTemplate = async (req, res) => {
  // const data = req.body;
  // const imageUrl = data.imgRes?.data?.data?.display_url ?? null;
  const { data, imageUrl } = req.body;
  const userId = req?.user?.id;
  console.log(data, userId, imageUrl);

  try {
    // Insert Data
    const newTemplate = await prisma.template.create({
      data: {
        title: data.title,
        description: data.description,
        imageUrl: imageUrl || null, // Set null if no img url
        topic: data.topic,
        tags: data.tags,
        accessType: data.accessType || "PUBLIC",
        createdById: userId,
        // Short questions
        shortQ1: data.shortQ1,
        showShortQ1: data.showShortQ1,
        shortQ2: data.shortQ2,
        showShortQ2: data.showShortQ2,
        shortQ3: data.shortQ3,
        showShortQ3: data.showShortQ3,
        shortQ4: data.shortQ4,
        showShortQ4: data.showShortQ4,
        // Multi-line questions
        desQ1: data.desQ1,
        showDesQ1: data.showDesQ1,
        desQ2: data.desQ2,
        showDesQ2: data.showDesQ2,
        desQ3: data.desQ3,
        showDesQ3: data.showDesQ3,
        desQ4: data.desQ4,
        showDesQ4: data.showDesQ4,
        // Numeric questions
        positiveInt1: data.positiveInt1,
        showPositiveInt1: data.showPositiveIntQ1,
        positiveInt2: data.positiveInt2,
        showPositiveInt2: data.showPositiveIntQ2,
        positiveInt3: data.positiveInt3,
        showPositiveInt3: data.showPositiveIntQ3,
        positiveInt4: data.positiveInt4,
        showPositiveInt4: data.showPositiveIntQ4,
        // Checkbox questions
        checkboxQ1Question: data.checkboxQ1?.question,
        checkboxQ1Option1: data.checkboxQ1?.option1,
        checkboxQ1Option2: data.checkboxQ1?.option2,
        checkboxQ1Option3: data.checkboxQ1?.option3,
        checkboxQ1Option4: data.checkboxQ1?.option4,

        checkboxQ2Question: data.checkboxQ2?.question,
        checkboxQ2Option1: data.checkboxQ2?.option1,
        checkboxQ2Option2: data.checkboxQ2?.option2,
        checkboxQ2Option3: data.checkboxQ2?.option3,
        checkboxQ2Option4: data.checkboxQ2?.option4,

        checkboxQ3Question: data.checkboxQ3?.question,
        checkboxQ3Option1: data.checkboxQ3?.option1,
        checkboxQ3Option2: data.checkboxQ3?.option2,
        checkboxQ3Option3: data.checkboxQ3?.option3,
        checkboxQ3Option4: data.checkboxQ3?.option4,

        checkboxQ4Question: data.checkboxQ4?.question,
        checkboxQ4Option1: data.checkboxQ4?.option1,
        checkboxQ4Option2: data.checkboxQ4?.option2,
        checkboxQ4Option3: data.checkboxQ4?.option3,
        checkboxQ4Option4: data.checkboxQ4?.option4,
      },
    });
    console.log("Template post data:", newTemplate);

    res.status(201).json(newTemplate);
  } catch (error) {
    console.error("Error catching template:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getTemplates = async (req, res) => {
  try {
    const templates = await prisma.template.findMany();
    res.status(200).json(templates);
  } catch (error) {
    console.error("Error getting templates", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getMyTemplates = async (req, res) => {
  try {
    const templates = await prisma.template.findMany({
      where: {
        createdById: req.user?.id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        topic: true,
        tags: true,
        createdAt: true,
        accessType: true,
        createdBy: {
          select: {
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(templates);
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal server error");
  }
};

exports.getTemplateById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "Template ID is required" });
    }

    const template = await prisma.template.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }

    res.status(200).json(template);
  } catch (error) {
    console.error("Error fetching single template", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateTemplate = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const updatedTemplate = await prisma.template.update({
      where: { id: Number(id) },
      data: data,
      select: { id: true },
    });
    res.status(200).json(updatedTemplate);
  } catch (error) {
    console.error("Error updating template", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete templates

exports.deleteTemplates = async (req, res) => {
  const { templateIds } = req.body;
  console.log("Template Ids from client side:", templateIds);
  try {
    const templates = await prisma.template.findMany({
      where: { id: { in: templateIds } },
      select: { id: true },
    });

    if (templates.length === 0) {
      return res.status(404).json({ error: "No template found" });
    }

    const deleteTemplates = await prisma.template.deleteMany({
      where: { id: { in: templateIds } },
    });

    // Send deleted result
    res.status(200).json({
      message: "Template(s) deleted.",
      result: deleteTemplates,
    });
  } catch (error) {
    console.error("Error delete user(s):", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Add Comment

exports.addComment = async (req, res) => {
  try {
    // Get text object from client side
    const { text } = req.body;
    const { templateId } = req.params;
    const authorId = req.user?.id;

    // Validate input
    if (!text) {
      return res.status(400).json({ error: "Comment text is required" });
    }
    // Searching for template if not template then comment will not work
    const template = await prisma.template.findUnique({
      where: { id: parseInt(templateId, 10) },
    });

    // // If i don't find any template using findUnique then
    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }

    // Create comment

    const newComment = await prisma.comment.create({
      data: {
        text,
        templateId: parseInt(templateId, 10),
        authorId: authorId,
      },
    });
    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error adding comments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET COMMENTS by template id

exports.getCommentsByTemplateId = async (req, res) => {
  try {
    const { templateId } = req.params;
    const comments = await prisma.comment.findMany({
      where: { templateId: parseInt(templateId, 10) },
      include: {
        author: true,
      },
    });
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST LIKE
exports.addLike = async (req, res) => {
  try {
    const { templateId } = req.params;
    const userId = req.user.id; // FROM JWT TOKEN
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_templateId: {
          userId: userId,
          templateId: parseInt(templateId, 10),
        },
      },
    });

    if (existingLike) {
      return res
        .status(409)
        .json({ error: "You've already liked this template" });
    }

    // Create a new like

    const newLike = await prisma.like.create({
      data: {
        userId: userId,
        templateId: parseInt(templateId, 10),
      },
    });

    res.status(201).json(newLike);
  } catch (error) {
    console.error("Error handling like:", error);

    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getLikesCount = async (req, res) => {
  try {
    const { templateId } = req.params;
    const parsedTemplatedId = parseInt(templateId, 10);

    if (isNaN(parsedTemplatedId)) {
      return res.status(400).json({ error: "Invalid template ID provided" });
    }

    const likeCount = await prisma.like.count({
      where: {
        templateId: parsedTemplatedId,
      },
    });

    res.status(200).json({
      templateId: parsedTemplatedId,
      likeCount: likeCount,
    });
  } catch (error) {
    console.error("Error fetching like count:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
