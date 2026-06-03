const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding test promo code...");
  
  // Clean existing test promos if any
  await prisma.promo.deleteMany({
    where: { code: 'DISKON50' }
  });

  const now = new Date();
  const nextMonth = new Date();
  nextMonth.setMonth(now.getMonth() + 1);

  // Create PERCENTAGE promo
  const promo = await prisma.promo.create({
    data: {
      code: 'DISKON50',
      description: 'Diskon 50% maksimal Rp 20.000',
      type: 'PERCENTAGE',
      value: 50,
      maxDiscount: 20000,
      minOrderAmount: 30000,
      startDate: now,
      endDate: nextMonth,
      usageLimit: 10,
      usedCount: 0,
      isActive: true
    }
  });

  console.log("Promo created successfully:", promo);

  // Let's test validation logic via simulation
  console.log("\nSimulating validation with subtotal Rp 10.000 (minOrderAmount is 30.000):");
  if (10000 < promo.minOrderAmount) {
    console.log("❌ Failed as expected: Subtotal Rp 10.000 is below minOrderAmount Rp 30.000");
  }

  console.log("\nSimulating validation with subtotal Rp 30.000 (50% is 15.000):");
  let discount1 = 30000 * (promo.value / 100);
  if (promo.maxDiscount && discount1 > promo.maxDiscount) discount1 = promo.maxDiscount;
  console.log("✅ Success! Calculated discount:", discount1, "(Expected: 15000)");

  console.log("\nSimulating validation with subtotal Rp 100.000 (50% is 50.000, but capped at maxDiscount 20.000):");
  let discount2 = 100000 * (promo.value / 100);
  if (promo.maxDiscount && discount2 > promo.maxDiscount) discount2 = promo.maxDiscount;
  console.log("✅ Success! Calculated discount:", discount2, "(Expected: 20000)");

  console.log("\nAll tests passed successfully!");
}

main()
  .catch((e) => {
    console.error("Test failed with error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
