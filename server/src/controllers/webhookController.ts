import { PrismaClient } from "../generated/prisma/client.js";
import { Request, Response } from "express";

const prisma = new PrismaClient();
const detectProvider = (req: Request): string | null => {
  if (req.headers["stripe-signature"]) return "stripe";
  if (req.headers["x-github-event"]) return "github";
  if (req.headers["x-razorpay-signature"]) return "razorpay";
  return null;
};

const getProviderMeta = (
  provider: string | null,
  req: Request
): { eventType: string | null; signatureValid: boolean | null } => {
  if (!provider) return { eventType: null, signatureValid: null };

  switch (provider.toLowerCase()) {
    case "stripe":
      return {
        eventType: req.body?.type ?? null,
        signatureValid: !!req.headers["stripe-signature"],
      };
    case "github":
      return {
        eventType: (req.headers["x-github-event"] as string) ?? null,
        signatureValid: !!(
          req.headers["x-hub-signature-256"] || req.headers["x-hub-signature"]
        ),
      };
    case "razorpay":
      return {
        eventType: req.body?.event ?? null,
        signatureValid: !!req.headers["x-razorpay-signature"],
      };
    default:
      return { eventType: null, signatureValid: null };
  }
};

export const logWebHook = async (req: Request, res: Response) => {
  const startTime = Date.now();
  res.sendStatus(200);

  try {
    const { token } = req.params;

    const endpoint = await prisma.endpoint.findUnique({
      where: { token: String(token) },
    });

    if (!endpoint) return;

    const rawBody =
      req.body instanceof Buffer
        ? req.body.toString("utf-8")
        : JSON.stringify(req.body ?? {});

    const provider = endpoint.provider ?? detectProvider(req);
    if (!endpoint.provider && provider) {
      await prisma.endpoint.update({
        where: { id: endpoint.id },
        data: { provider },
      });
    }
    const { eventType, signatureValid } = getProviderMeta(provider, req);
    await prisma.response.create({
      data: {
        method: req.method,
        headers: JSON.stringify(req.headers),
        body: rawBody,
        ipAddress: req.ip || "unknown",
        eventType,
        statusCode: 200,
        processingTime: Date.now() - startTime,
        signatureValid,
        endpointId: endpoint.id,
      },
    });
  } catch (error) {
    console.error("Webhook logging failed:", error);
  }
};
