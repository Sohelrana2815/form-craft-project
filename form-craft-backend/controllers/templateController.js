const prisma = require("../db");

exports.createTemplate = async (req, res) => {
  const {
    title,
    description,
    imageUrl,
    topicId,
    tags,
    accessType = "PUBLIC",
    allowedUsers,
  } = req.body;

  const creatorId = req.user.id; // From JWT

  // ─── 1. Basic Validation ───

  // 1.1. Title (required, non-empty, ≤ 255 chars)
  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Template title is required." });
  }

  if (title.length > 255) {
    return res
      .status(400)
      .json({ message: "Template title cannot exceed 255 characters." });
  }

  // 1.2. Description (required, non-empty)

  if (!description || description.trim() === "") {
    return res
      .status(400)
      .json({ message: "Template description is required." });
  }

  // 1.3. topicId (required, must be a positive integer)
  if (topicId === undefined || topicId === null) {
    return res.status(400).json({ message: "Topic ID is required." });
  }

  if (typeof topicId !== "number" || isNaN(topicId) || topicId <= 0) {
    return res
      .status(400)
      .json({ message: "Topic ID must be a valid number." });
  }

  // 1.4. tags (optional). If provided, must be an array of non-empty strings.
  let normalizedTagNames = [];

  if (tags !== undefined) {
    if (!Array.isArray(tags)) {
      return res
        .status(400)
        .json({ message: "Tags must be an array of strings." });
    }

    // Trim + filter out empty strings

    normalizedTagNames = tags.map((t) =>
      typeof t === "string" ? t.trim() : ""
    ); // If string remove white spaces if not convert it to empty string

    // Ensure no duplicates

    const uniqueSet = new Set(normalizedTagNames);

    if (uniqueSet.size !== normalizedTagNames.length) {
      return res
        .status(400)
        .json({ message: "Duplicate tag names are not allowed." });
    }

    // Ensure each tag is ≤ 20 characters (since @db.VarChar(20) in schema)

    for (const name of normalizedTagNames) {
      if (name.length > 20) {
        return res.status(400).json({
          message: `Tag "${name}" cannot exceed 20 characters (max).`,
        });
      }
    }
  }

  // 1.5. accessType (must be "PUBLIC" or "RESTRICTED")
  const validAccessTypes = ["PUBLIC", "RESTRICTED"];
  if (!validAccessTypes.includes(accessType)) {
    return res.status(400).json({
      message: `Invalid accessType. Must be one of: ${validAccessTypes.join(
        ", "
      )}`,
    });
  }

  // 1.6. If restricted, allowedUsers must be a non-empty array of positive integers
  let normalizedAllowedUsers = [];
  if (accessType === "RESTRICTED") {
    if (!Array.isArray(allowedUsers) || allowedUsers.length === 0) {
      return res.status(400).json({
        message:
          "When accessType is 'RESTRICTED', you must provide a non-empty array of allowedUsers (user IDs).",
      });
    }
    normalizedAllowedUsers = allowedUsers
      .map((u) => Number(u))
      .filter((u) => Number.isFinite(u) && u > 0);
    if (normalizedAllowedUsers.length !== allowedUsers.length) {
      return res
        .status(400)
        .json({ message: "Every allowed user ID must be a positive integer." });
    }
    // Ensure no duplicates
    if (
      new Set(normalizedAllowedUsers).size !== normalizedAllowedUsers.length
    ) {
      return res.status(400).json({
        message: "Duplicate user IDs in allowedUsers are not allowed.",
      });
    }
  }

  // ─── 2. Referential Integrity & Bulk Tag Upsert ───
  try {
    // 2.1. Check Topic exists
    const existingTopic = await prisma.topic.findUnique({
      where: { id: topicId },
      select: { id: true },
    });
    if (!existingTopic) {
      return res
        .status(404)
        .json({ message: "Provided Topic ID does not exist." });
    }

    // 2.2. Handle tags (upsert new ones, then fetch all)
    let connectTags = [];
    if (normalizedTagNames.length > 0) {
      // 2.2.1. Find all tags whose name is in normalizedTagNames
      const foundTags = await prisma.tag.findMany({
        where: { name: { in: normalizedTagNames } },
        select: { id: true, name: true },
      });
      const existingNames = new Set(foundTags.map((t) => t.name));

      // 2.2.2. Determine which tag names need to be created
      const toCreate = normalizedTagNames.filter((n) => !existingNames.has(n));
      if (toCreate.length > 0) {
        // Bulk‐create new tags in one call (skip duplicates just in case)
        await prisma.tag.createMany({
          data: toCreate.map((name) => ({ name })),
          skipDuplicates: true,
        });
      }

      // 2.2.3. Re‐fetch all tags by name to get their IDs
      const finalTags = await prisma.tag.findMany({
        where: { name: { in: normalizedTagNames } },
        select: { id: true },
      });
      connectTags = finalTags.map((t) => ({ id: t.id }));
    }

    // 2.3. If restricted, verify all allowedUsers exist
    let permissionCreates = [];
    if (accessType === "RESTRICTED") {
      const foundAllowed = await prisma.user.findMany({
        where: { id: { in: normalizedAllowedUsers } },
        select: { id: true },
      });
      if (foundAllowed.length !== normalizedAllowedUsers.length) {
        const foundIds = foundAllowed.map((u) => u.id);
        const missing = normalizedAllowedUsers.filter(
          (u) => !foundIds.includes(u)
        );
        return res.status(404).json({
          message: "One or more provided allowed user IDs do not exist.",
          notFoundUserIds: missing,
        });
      }
      // Build the nested create array
      permissionCreates = normalizedAllowedUsers.map((uid) => ({
        user: { connect: { id: uid } },
      }));
    }

    // ─── 3. Create Template ─────
    const newTemplate = await prisma.template.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        imageUrl: imageUrl?.trim() || null,
        topic: { connect: { id: topicId } },
        creator: { connect: { id: creatorId } },
        accessType, // "PUBLIC" or "RESTRICTED"
        tags: {
          connect: connectTags, // [] if no tags, or e.g. [ {id:4}, {id:7}, … ]
        },
        // Only add permissions when restricted
        ...(accessType === "RESTRICTED" && {
          permissions: {
            create: permissionCreates,
          },
        }),
      },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        accessType: true,
        createdAt: true,
        topic: { select: { id: true, name: true } },
        creator: { select: { id: true, username: true, email: true } },
        tags: { select: { id: true, name: true } },
        ...(accessType === "RESTRICTED" && {
          permissions: {
            select: {
              user: { select: { id: true, username: true, email: true } },
            },
          },
        }),
      },
    });

    return res.status(201).json({
      message: "Template created successfully.",
      template: newTemplate,
    });
  } catch (error) {
    console.error("Error creating template:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

exports.getTemplates = async (req, res) => {
  try {
    const templates = await prisma.template.findMany();
    return res.status(200).json(templates);
  } catch (err) {
    console.error("Error fetching templates:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};

//  GET PUBLIC TEMPLATES

exports.getPublicTemplates = async (req, res) => {
  try {
    const publicTemplates = await prisma.template.findMany({
      where: {
        accessType: "PUBLIC",
      },
      include: {
        // Include the Topic (id + name)
        topic: { select: { id: true, name: true } },
        // Include the Creator’s basic info (id, username, email)
        creator: { select: { id: true, username: true, email: true } },
        // Include the Tags array (id + name)
        tags: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(publicTemplates);
  } catch (err) {
    console.error("Error fetching public templates:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// GET A SINGLE TEMPLATE BY ID

exports.getTemplateById = async (req, res) => {
  const id = Number(req.params.id);
  console.log("GET TEMPLATE ID", id);
  if (!Number.isInteger(id) || id <= 0) {
    return res
      .status(400)
      .json({ message: "Template ID must be a positive integer" });
  }

  try {
    const template = await prisma.template.findUnique({
      where: { id },
      include: {
        topic: { select: { id: true, name: true } },
        creator: { select: { id: true, username: true, email: true } },
        tags: { select: { id: true, name: true } },
        questions: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            title: true,
            description: true,
            type: true,
            allowMultiple: true,
            order: true,
            showInList: true,
            options: true,
          },
        },
        permissions: {
          select: {
            user: { select: { id: true, username: true } },
          },
        },
      },
    });

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    // Enforce RESTRICTED access, if you need it
    if (template.accessType === "RESTRICTED") {
      const userId = req.user.id;
      const isCreator = template.creatorId === userId;
      const isAllowed = template.permissions.some((p) => p.user.id === userId);

      if (!isCreator && !isAllowed) {
        return res.status(403).json({
          message: "You do not have permission to view this template.",
        });
      }
    }

    return res.status(200).json(template);
  } catch (err) {
    console.error("Error fetching template:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// GET USER CREATED TEMPLATES
exports.getMyTemplates = async (req, res) => {
  const userId = req.user.id;
  try {
    const templates = await prisma.template.findMany({
      where: { creatorId: userId },
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, createdAt: true },
    });
    return res.status(200).json(templates);
  } catch (error) {
    console.error("Error fetching my templates:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// UPDATE TEMPLATE QUESTIONS

exports.updateTemplateQuestions = async (req, res) => {
  const templateId = Number(req.params.id);
  const userId = req.user.id;
  const questionsToUpdate = req.body;

  console.log(
    "templateId:",
    templateId,
    "userId:",
    userId,
    "Questions:",
    questionsToUpdate
  );

  // Validate template ID

  if (!Number.isInteger(templateId) || templateId <= 0) {
    return res.status(400).json({ message: "Invalid template ID" });
  }

  // Validate request body

  if (!Array.isArray(questionsToUpdate) || questionsToUpdate.length === 0) {
    return res.status(400).json({
      message: "Request body must be a non-empty array of question objects ",
    });
  }

  try {
    // 1. Verify template exists and user has permission

    const template = await prisma.template.findUnique({
      where: { id: templateId },
      select: {
        creatorId: true,
        accessType: true,
        permissions: { select: { userId: true } },
      },
    });

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    // Authorization check
    const isCreator = template.creatorId === userId;
    const hasPermission = template.permissions.some((p) => p.userId === userId);

    if (template.accessType === "RESTRICTED" && !isCreator && !hasPermission) {
      return res.status(403).json({
        message: "You don't have permission to modify this template",
      });
    }

    // 2. Validate all question IDs belong to this template

    const existingQuestionIds = await prisma.question
      .findMany({
        where: { templateId },
        select: { id: true },
      })
      .then((questions) => questions.map((q) => q.id));

    const invalidQuestionIds = questionsToUpdate
      .filter((q) => !existingQuestionIds.includes(q.id))
      .map((q) => q.id);

    if (invalidQuestionIds.length > 0) {
      return res.status(400).json({
        message: `Invalid question IDs: ${invalidQuestionIds.join(",")}`,
        validQuestionIds: existingQuestionIds,
      });
    }

    // 3. Prepare update operations

    const updateOperations = questionsToUpdate.map((question) => {
      const updateData = {
        title: question.title,
        description: question.description,
        type: question.type,
        order: question.order,
        showInList: question.showInList,
        // Handle allowMultiple based on question type
        allowMultiple:
          question.type === "CHOICE" ? Boolean(question.allowMultiple) : false,

        options:
          question.type === "CHOICE" && Array.isArray(question.options)
            ? question.options
            : [],
      };
      return prisma.question.update({
        where: { id: question.id },
        data: updateData,
      });
    });

    // 4. Execute all updates in a single transaction

    const updatedQuestions = await prisma.$transaction(updateOperations);

    return res.status(200).json({
      message: "Questions updated successfully",
      updatedCount: updatedQuestions.length,
      questions: updatedQuestions,
    });
  } catch (error) {
    console.error("Error updating questions:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};
