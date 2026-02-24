import { PrismaClient, Prisma } from "../generated/prisma/client.js";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const logWebHook = async (req: Request, res: Response) => {
  const startTime=Date.now();
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
       let eventType:string|null=null;
       let signatureValid:boolean|null=null;
       if(endpoint.provider==="stripe"){
        eventType=req.body?.type||null;
        const signature=req.headers["stripe-signature"];
        signatureValid=signature?true:false;
       } 
       if(endpoint.provider==="github"){
        eventType=req.headers["x-github-event"] as string;
        const signature=req.headers["x-hub-signature-256"] || req.headers["x-hub-signature"];
        signatureValid=signature?true:false;
       }
       if(endpoint.provider==="razorpay"){
        eventType=req.body?.event||null;
        const signature=req.headers["x-razorpay-signature"];
        signatureValid=signature?true:false;
       }
       const processingTime=Date.now()-startTime;
    await prisma.response.create({
      data: {
        method: req.method,
        headers: JSON.stringify(req.headers),
        body: rawBody,
        ipAddress: req.ip || "unknown",

        eventType,
        statusCode:200,
        processingTime,
        signatureValid,


        endpointId: endpoint.id,
      },
    });
  } catch (error) {
    console.error("Webhook logging failed:", error);
    return;
  }
};
