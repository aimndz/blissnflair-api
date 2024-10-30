import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      {
        id: "1",
        firstName: "User1",
        lastName: "User1",
        email: "user1@test.com",
        password: "user1",
      },
      {
        id: "2",
        firstName: "User2",
        lastName: "User2",
        email: "user2@test.com",
        password: "user2",
      },
      {
        id: "3",
        firstName: "admin",
        lastName: "admin1",
        email: "admin@test.com",
        password: "admin",
        role: "ADMIN",
      },
    ],
  });

  await prisma.event.createMany({
    data: [
      {
        title: "Event 1",
        description: "Event 1 description",
        category: "WEDDING",
        expectedPax: 100,
        date: new Date("2024-10-31"),
        startTime: new Date("2024-10-31T09:00:00Z"),
        endTime: new Date("2024-10-31T17:00:00Z"),
        status: "APPROVED",
        additionalNotes: "Additional notes for event 1",
        additionalServices: ["Service 1", "Service 2"],
        userId: "1",
      },
      {
        title: "Event 2",
        description: "Event 2 description",
        category: "BIRTHDAY",
        expectedPax: 100,
        date: new Date("2024-11-10"),
        startTime: new Date("2024-11-10T14:00:00Z"),
        endTime: new Date("2024-11-10T22:00:00Z"),
        additionalNotes: "Additional notes for event 2",
        additionalServices: ["Service 1", "Service 2"],
        userId: "2",
      },
      {
        title: "Event 3",
        description: "Event 3 description",
        category: "BUSINESS",
        expectedPax: 100,
        date: new Date("2024-11-13"),
        startTime: new Date("2024-11-13T14:00:00Z"),
        endTime: new Date("2024-11-13T22:00:00Z"),
        additionalNotes: "Additional notes for event 3",
        additionalServices: ["Service 1", "Service 2"],
        userId: "3",
      },
    ],
  });
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
