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