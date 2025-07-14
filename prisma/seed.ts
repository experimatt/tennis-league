import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      passwordHash: hashedPassword,
      name: "Admin User",
      role: "admin",
    },
  });

  console.log("Created admin user:", adminUser);

  // Create default league (if it doesn't exist)
  const existingLeague = await prisma.league.findFirst({
    where: { name: "2025 Demo League" },
  });

  let defaultLeague;
  if (!existingLeague) {
    defaultLeague = await prisma.league.create({
      data: {
        name: "2025 Demo League",
        description: "Demo tennis league for 2025",
        adminId: adminUser.id,
        status: "active",
      },
    });
  } else {
    defaultLeague = existingLeague;
  }

  console.log("Created default league:", defaultLeague);

  // Create some sample players for testing
  const samplePlayers = [
    { name: "John Smith", email: "john@example.com", username: "jsmith" },
    { name: "Sarah Johnson", email: "sarah@example.com", username: "sjohnson" },
    { name: "Mike Davis", email: "mike@example.com", username: "mdavis" },
    { name: "Emily Wilson", email: "emily@example.com", username: "ewilson" },
    { name: "Chris Brown", email: "chris@example.com", username: "cbrown" },
  ];

  for (const playerData of samplePlayers) {
    const existingPlayer = await prisma.player.findFirst({
      where: { name: playerData.name },
    });

    if (!existingPlayer) {
      const player = await prisma.player.create({
        data: playerData,
      });
      console.log("Created player:", player.name);
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }); 