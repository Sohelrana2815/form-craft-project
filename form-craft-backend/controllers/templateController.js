const prisma = require("../db");

exports.createTemplate = async (req, res) => {
  const postData = req.body;
  console.log(postData);

  try {
    // Insert Data

    const newTemplate = await prisma.template.create({
      data: {
        title: postData.title,
        description: postData.description,
        imageUrl: postData.imageUrl,
        // Short questions
        shortQ1: postData.shortQ1,
        showShortQ1: postData.showShortQ1,
        shortQ2: postData.shortQ2,
        showShortQ2: postData.showShortQ2,
        shortQ3: postData.shortQ3,
        showShortQ3: postData.showShortQ3,
        shortQ4: postData.shortQ4,
        showShortQ4: postData.showShortQ4,
        // Multi-line questions
        desQ1: postData.desQ1,
        showDesQ1: postData.showDesQ1,
        desQ2: postData.desQ2,
        showDesQ2: postData.showDesQ2,
        desQ3: postData.desQ3,
        showDesQ3: postData.showDesQ3,
        desQ4: postData.desQ4,
        showDesQ4: postData.showDesQ4,
        // Numeric questions
        positiveInt1: postData.positiveInt1,
        showPositiveInt1: postData.showPositiveInt1,
        positiveInt2: postData.positiveInt2,
        showPositiveInt2: postData.showPositiveInt2,
        positiveInt3: postData.positiveInt3,
        showPositiveInt3: postData.showPositiveInt3,
        positiveInt4: postData.positiveInt4,
        showPositiveInt4: postData.showPositiveInt4,
        // Checkbox questions
        checkboxQ1Question: postData.checkboxQ1Question,
        checkboxQ1Option1: postData.checkboxQ1Option1,
        checkboxQ1Option2: postData.checkboxQ1Option2,
        checkboxQ1Option3: postData.checkboxQ1Option3,
        checkboxQ1Option4: postData.checkboxQ1Option4,

        checkboxQ2Question: postData.checkboxQ2Question,
        checkboxQ2Option1: postData.checkboxQ2Option1,
        checkboxQ2Option2: postData.checkboxQ2Option2,
        checkboxQ2Option3: postData.checkboxQ2Option3,
        checkboxQ2Option4: postData.checkboxQ2Option4,

        checkboxQ3Question: postData.checkboxQ3Question,
        checkboxQ3Option1: postData.checkboxQ3Option1,
        checkboxQ3Option2: postData.checkboxQ3Option2,
        checkboxQ3Option3: postData.checkboxQ3Option3,
        checkboxQ3Option4: postData.checkboxQ3Option4,

        checkboxQ4Question: postData.checkboxQ4Question,
        checkboxQ4Option1: postData.checkboxQ4Option1,
        checkboxQ4Option2: postData.checkboxQ4Option2,
        checkboxQ4Option3: postData.checkboxQ4Option3,
        checkboxQ4Option4: postData.checkboxQ4Option4,
      },
    });

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
