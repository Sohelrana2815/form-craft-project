const { PrismaClient } = require("./src/generated/client");

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Database connection successful.");

    const userCount = await prisma.user.count();
    console.log(`Total users: ${userCount}`);
  } catch (error) {
    console.error("❌ Database test failed:", error.message);
    process.exit(1);
  }
}

testDatabase();

module.exports = prisma;
