const prisma = require("../db");

const VALID_TYPES = [
  "SHORT_TEXT",
  "LONG_TEXT",
  "INTEGER",
  "CHECKBOX",
  "MULTIPLE_CHOICE",
];

exports.createQuestions = async (req, res) => {
  const { templateId } = req.params;
  const { questions } = req.body;
  const creatorId = req.user.id; // From JWT token

  // ─── 1. Validate templateId ──
  const templateIdNum = Number(templateId);
  if (!Number.isInteger(templateIdNum) || templateIdNum <= 0) {
    return res
      .status(400)
      .json({ message: "TemplateId must be a positive integer" });
  }

  // Check that template exists, and optionally that req.user.id === template.creatorId

  const existingTemplate = await prisma.template.findUnique({
    where: { id: templateIdNum },
    select: { id: true, creatorId: true },
  });

  if (!existingTemplate) {
    return res.status(404).json({ message: "Template not found." });
  }

  // ─── 2. Validate payload shape ────

  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({
      message:
        "Request body must be { questions: [...] } with at least one question.",
    });
  }
  // 2.1. Within this batch, ensure no duplicate `order` values

  const orders = questions.map((q) => q.order);
  const uniqueOrders = new Set(orders);

  if (uniqueOrders.size !== orders.length) {
    return res
      .status(400)
      .json({ message: "Duplicate order values found in the payload." });
  }
  // 2.2. Validate each question’s fields & tally types

  //  We’ll also prepare an array of `Prisma.QuestionCreateManyInput` objects.


  
};
