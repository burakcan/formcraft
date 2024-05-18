import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

const prisma = new PrismaClient();

async function cleanAnswers() {
  console.info("Cleaning answers...");

  const { count } = await prisma.craftSubmission.deleteMany({
    where: {
      // Delete all empty answers older than 1 day
      createdAt: {
        lt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      },
      data: {
        equals: {},
      }
    }
  });

  console.info("Cleaned answers: ", count);
}

async function cleanVersions() {
  const allCrafts = await prisma.craft.findMany({
    where: {
      NOT: {
        id: "VeUBRB2twi"
      }
    },
    // published but no submissions.
    // skip 1 to avoid deleting the latest version
    include: {
      craftVersions: {
        where: {
          NOT: {
            publishedAt: null,
            craftSubmissions: {
              some: {
                data: {
                  equals: {}
                }
              }
            }
          },
        },
        skip: 1,
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });

  const versionsToDelete = allCrafts.flatMap(craft => craft.craftVersions);

  console.info("Cleaning versions...");

  const { count } = await prisma.craftVersion.deleteMany({
    where: {
      id: {
        in: versionsToDelete.map(version => version.id)
      }
    }
  });

  console.info("Cleaned versions: ", count);
}

export async function syncStripe() {
  await cleanAnswers();
  await cleanVersions();
}

syncStripe();