const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning up database tables to avoid FK issues...");
  try {
    await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 0;');
    await prisma.paymentProof.deleteMany({});
    await prisma.payment.deleteMany({});
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1;');
    console.log("Cleanup finished successfully!");
  } catch (error) {
    console.error("Error during cleanup:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
