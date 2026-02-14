import { PrismaClient, Prisma } from "../generated/prisma/client.js";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const logWebHook = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    const endpoint = await prisma.endpoint.findUnique({
      where: {
        token: String(token),
      },
    });
    if (!endpoint) {
      return res.sendStatus(404);
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

    return res.sendStatus(200);
  } catch (error) {
    console.error("Webhook logging failed:", error);
    return res.sendStatus(200);
  }
};
