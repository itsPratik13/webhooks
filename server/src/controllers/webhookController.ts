import { PrismaClient, Prisma } from "../generated/prisma/client.js";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const logWebHook = async (req: Request, res: Response) => {
   res.sendStatus(200);
  try {
    const { token } = req.params;

    const endpoint = await prisma.endpoint.findUnique({
      where: {
        token: String(token),
      },
    });
    if (!endpoint) {
      return;
    }
    const rawBody =
      req.body instanceof Buffer
        ? req.body.toString("utf-8")
        : JSON.stringify(req.body ?? {});
    await prisma.response.create({
      data: {
        method: req.method,
        headers: JSON.stringify(req.headers),
        body: rawBody,
        ipAddress: req.ip || "unknown",

        endpointId: endpoint.id,
      },
    });
  } catch (error) {
    console.error("Webhook logging failed:", error);
    return;
  }
};
