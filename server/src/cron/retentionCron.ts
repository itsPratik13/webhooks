import { PrismaClient } from "../generated/prisma/client.js";
import cron from "node-cron";

const prisma = new PrismaClient();
cron.schedule("0 * * * *", async () => {
  try {
    // *****  min ,hr,day of month ,month,day of week
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); // all in ms 24 hr retention
    const deleted = await prisma.response.deleteMany({
      where: {
        receivedAt: { lt: cutoff },
      },
    });
    console.log(`Deleted ${deleted.count} old responses from the database.`);
  } catch (error) {
    console.log("Error during retention cron job:", error);

  }
});
