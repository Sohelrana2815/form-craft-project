const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const testDatabase = async () => {
  try {
    // Asking one raw & one column from database
    await prisma.$queryRaw`SELECT 1`;
    console.log("Database connected successfully.✅");
    // GET the user count
    const userCount = await prisma.user.count();
    console.log(`Total users: 👥  ${userCount}`);
  } catch (error) {
    console.error("Failed to connect with Database.❌", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

testDatabase();

module.exports = prisma;
