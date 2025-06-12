// src/controllers/questionController.js
const prisma = require("../db");

// Now that schema’s enum is [SHORT_TEXT, LONG_TEXT, INTEGER, CHOICE], adjust VALID_TYPES:
const VALID_TYPES = ["SHORT_TEXT", "LONG_TEXT", "INTEGER", "CHOICE"];

exports.createQuestions = async (req, res) => {
  const { templateId } = req.params;
  const { questions } = req.body;
  const creatorId = req.user.id;

  // ─── 1. Validate templateId ────
  const templateIdNum = Number(templateId);
  if (!Number.isInteger(templateIdNum) || templateIdNum <= 0) {
    return res
      .status(400)
      .json({ message: "templateId must be a positive integer." });
  }

  // Verify template exists and that this user is its creator
  const existingTemplate = await prisma.template.findUnique({
    where: { id: templateIdNum },
    select: { id: true, creatorId: true },
  });
  if (!existingTemplate) {
    return res.status(404).json({ message: "Template not found." });
  }
  if (existingTemplate.creatorId !== creatorId) {
    return res.status(403).json({
      message: "You are not authorized to add questions to this template.",
    });
  }

  // ─── 2. Validate payload shape ───
  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({
      message:
        "Request body must be { questions: [...] } with at least one question.",
    });
  }

  // 2.1. Check for duplicate order values in this batch
  const orders = questions.map((q) => q.order);
  const uniqueOrders = new Set(orders);
  if (uniqueOrders.size !== orders.length) {
    return res
      .status(400)
      .json({ message: "Duplicate order values found in the payload." });
  }

  // 2.2. Validate each question’s fields & tally counts by type
  const toCreate = [];
  const incomingTypeCounts = {
    SHORT_TEXT: 0,
    LONG_TEXT: 0,
    INTEGER: 0,
    CHOICE: 0,
  };

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];

    // Title (required, ≤ 200 chars)
    if (!q.title || typeof q.title !== "string" || q.title.trim() === "") {
      return res.status(400).json({
        message: `questions[${i}].title is required and must be a non-empty string.`,
      });
    }
    if (q.title.length > 200) {
      return res.status(400).json({
        message: `questions[${i}].title cannot exceed 200 characters.`,
      });
    }

    // Type (must be one of VALID_TYPES)
    if (
      !q.type ||
      typeof q.type !== "string" ||
      !VALID_TYPES.includes(q.type)
    ) {
      return res.status(400).json({
        message: `questions[${i}].type is required and must be one of ${VALID_TYPES.join(
          ", "
        )}.`,
      });
    }
    incomingTypeCounts[q.type]++;

    // Description (optional)
    if (
      q.description !== undefined &&
      q.description !== null &&
      typeof q.description !== "string"
    ) {
      return res.status(400).json({
        message: `questions[${i}].description must be a string or null if provided.`,
      });
    }

    // Order (required integer ≥ 0)
    if (
      q.order === undefined ||
      typeof q.order !== "number" ||
      !Number.isInteger(q.order) ||
      q.order < 0
    ) {
      return res.status(400).json({
        message: `questions[${i}].order is required and must be a non-negative integer.`,
      });
    }

    // showInList (required boolean)
    if (typeof q.showInList !== "boolean") {
      return res.status(400).json({
        message: `questions[${i}].showInList is required and must be a boolean.`,
      });
    }

    // OPTIONS: Only if type === "CHOICE"
    let optionsArray = [];
    let allowMultiple = false;
    if (q.type === "CHOICE") {
      // Must include allowMultiple (boolean) and options (non-empty array of strings)
      if (typeof q.allowMultiple !== "boolean") {
        return res.status(400).json({
          message: `questions[${i}].allowMultiple is required and must be a boolean when type is CHOICE.`,
        });
      }
      allowMultiple = q.allowMultiple;

      if (!Array.isArray(q.options) || q.options.length === 0) {
        return res.status(400).json({
          message: `questions[${i}].options must be a non-empty array of strings when type is CHOICE.`,
        });
      }
      if (q.options.length > 4) {
        return res.status(400).json({
          message: `questions[${i}].options cannot have more than 4 entries.`,
        });
      }
      for (let j = 0; j < q.options.length; j++) {
        if (typeof q.options[j] !== "string" || q.options[j].trim() === "") {
          return res.status(400).json({
            message: `questions[${i}].options[${j}] must be a non-empty string.`,
          });
        }
        if (q.options[j].length > 100) {
          return res.status(400).json({
            message: `questions[${i}].options[${j}] cannot exceed 100 characters.`,
          });
        }
      }
      // Trim each option
      optionsArray = q.options.map((opt) => opt.trim());
    } else {
      // For non‐CHOICE types, ignore any passed-in options/allowMultiple
      optionsArray = [];
      allowMultiple = false;
    }

    // Build the object for createMany()
    toCreate.push({
      title: q.title.trim(),
      description: q.description?.trim() || null,
      type: q.type, // one of SHORT_TEXT, LONG_TEXT, INTEGER, CHOICE
      allowMultiple, // only meaningful when type === "CHOICE"
      order: q.order,
      showInList: q.showInList,
      options: optionsArray, // string[] column
      templateId: templateIdNum,
    });
  }

  // ─── 3. Enforce “max 4 per type” ───
  const existingCounts = await prisma.question.groupBy({
    by: ["type"],
    where: { templateId: templateIdNum },
    _count: { type: true },
  });
  const existingTypeCounts = existingCounts.reduce(
    (acc, row) => {
      acc[row.type] = row._count.type;
      return acc;
    },
    { SHORT_TEXT: 0, LONG_TEXT: 0, INTEGER: 0, CHOICE: 0 }
  );

  for (const type of VALID_TYPES) {
    const total = existingTypeCounts[type] + incomingTypeCounts[type];
    if (total > 4) {
      return res.status(400).json({
        message: `You can have at most 4 questions of type '${type}' per template. Currently existing: ${existingTypeCounts[type]}, incoming: ${incomingTypeCounts[type]}.`,
      });
    }
  }

  // ─── 4. Bulk‐insert all new questions ────
  try {
    const created = await prisma.$transaction(async (tx) => {
      // 4.1. Insert all questions in one batch
      await tx.question.createMany({
        data: toCreate,
      });

      // 4.2. Fetch back all questions for this template, ordered by `order`
      return tx.question.findMany({
        where: { templateId: templateIdNum },
        orderBy: { order: "asc" },
      });
    });

    return res.status(201).json({
      message: "Questions created successfully.",
      questions: created,
    });
  } catch (dbErr) {
    console.error("Error creating questions:", dbErr);
    return res.status(500).json({ error: "Internal server error." });
  }
};

exports.getQuestions = async (req, res) => {
  try {
    const questions = await prisma.question.findMany();
    res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching topics:", err);
    res.status(500).json({ error: "Failed to fetch tags" });
  }
};
