const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seedTopics() {
  try {
    const predefinedTopics = ["Education", "Quiz", "Job", "Sports", "Other"];

    await prisma.topic.createMany({
      data: predefinedTopics.map((name) => ({ name })),
      skipDuplicates: true, // It will skip same topic name
    });

    console.log("✅ Topics seeded successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedTopics();
