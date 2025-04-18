const { PrismaClient } = require("@prisma/client");

// Prisma client instance
const prisma = new PrismaClient();

// Connection test (Optional)

async function testConnection() {
  try {
    await prisma.$connect();
    console.log("✅ Prisma connected.");
  } catch (error) {
    console.error("❌ Failed to connect", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();

module.exports = prisma;
