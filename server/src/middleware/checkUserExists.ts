import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../generated/prisma/client.js";

const prisma = new PrismaClient();

export const UserExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const clerkId = req.auth?.userId;

    if (!clerkId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const email = req.auth?.sessionClaims?.email as string | undefined;

    const user = await prisma.user.upsert({
      where: { clerkUserId: clerkId },
      update: {},
      create: {
        clerkUserId: clerkId,
        email: email ?? "unknown",
      },
    });

    req.dbUser = user;

    next();
  } catch (error) {
    console.error("User sync failed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
