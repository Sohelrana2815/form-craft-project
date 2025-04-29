const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const predefinedTopics = ["Education", "Quiz", "Job", "Other"];
const predefinedTags = ["react", "nodejs", "database", "api", 'JavaScript','C#','java','graphic design'];
const seedAll = async () => {
  try {
    // Topic seed
    await prisma.topic.createMany({
      data: predefinedTopics.map((name) => ({ name })),
      skipDuplicates: true,
    });

    // Tags seed
    await prisma.tag.deleteMany();
    await prisma.tag.createMany({
      data: predefinedTags.map((name) => ({ name })),
      skipDuplicates: true,
    });
    console.log("✅ All data seeded successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await prisma.$disconnect();
  }
};

seedAll();
