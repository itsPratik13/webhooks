import { PrismaClient } from "../generated/prisma/client.js";
import { Request, Response } from "express";
import crypto from "crypto";

const prisma = new PrismaClient();
const detectProvider = (req: Request): string | null => {
  if (req.headers["stripe-signature"]) return "stripe";
  if (req.headers["x-github-event"]) return "github";
  if (req.headers["x-razorpay-signature"]) return "razorpay";
  return null;
};

export const verifyStripeSignature = (
  rawBody: string,
  signature: string,
  secret: string
): boolean => {
  try {
    const parts = signature.split(",");
    const timestamp = parts
      .find((part) => part.startsWith("t="))
      ?.split("=")[1];
    const sign = parts.find((part) => part.startsWith("v1="))?.split("=")[1];
    if (!timestamp || !sign) {
      return false;
    }
    const payload = `${timestamp}.${rawBody}`;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
};
export const verifyRazorPaySignature = (
  rawBody: string,
  signature: string,
  secret: string
): boolean => {
  try {
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
};
export const verifyGithubSignature = (
  rawBody: string,
  signature: string,
  secret: string
): boolean => {
  try {
    const expectedSignature="sha256="+crypto.createHmac("sha256",secret).update(rawBody).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(signature),Buffer.from(expectedSignature));
  } catch {
    return false;
  }
};

const getProviderMeta = (
  provider: string | null,
  req: Request,
  rawBody: string,
  signingSecret:string|null
): { eventType: string | null; signatureValid: boolean | null } => {
  if (!provider) return { eventType: null, signatureValid: null };

  switch (provider.toLowerCase()) {
    case "stripe":{
      const signature = req.headers["stripe-signature"] as string;
      return {
        eventType: req.body?.type ?? null,
        signatureValid:signingSecret && signature ? verifyStripeSignature(rawBody,signature,signingSecret):!!signature,
      };
    }
    case "github":{
      const signature = (req.headers["x-hub-signature-256"] || req.headers["x-hub-signature"]) as string;
      return {
        eventType: (req.headers["x-github-event"] as string) ?? null,
        signatureValid:signingSecret && signature ?verifyGithubSignature(rawBody,signature,signingSecret):!!signature,
      };
    }
    case "razorpay":{
      const signature = req.headers["x-razorpay-signature"] as string;
      return {
        eventType: req.body?.event ?? null,
        signatureValid: signature && signingSecret?verifyRazorPaySignature(rawBody,signature,signingSecret):!!signature,
      };
    }
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
    const { eventType, signatureValid } = getProviderMeta(provider, req,rawBody,endpoint.signingSecret);
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
