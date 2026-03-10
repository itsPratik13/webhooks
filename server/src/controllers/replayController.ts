import { PrismaClient } from "../generated/prisma/client.js";

import { Request, Response } from "express";
const prisma = new PrismaClient();

type ReplayProps = {
  replayUrl: string;
  headers?: Record<string, string>;
  body?: string;
};

export const replayWebhooks = async (req: Request, res: Response) => {
  try {
    const { responseId } = req.params;
    if (isNaN(Number(responseId))) {
      return res.status(400).json({ message: "Invalid endpoint ID" });
    }
    const { replayUrl, headers, body } = req.body as ReplayProps;
    if (!replayUrl) {
      return res.status(400).json({ message: "replayUrl is required" });
    }

    const webhook = await prisma.response.findUnique({
      where: {
        id: Number(responseId),
      },
      include: {
        endpoint: true,
      },
    });

    if (!webhook || webhook.endpoint.userId !== req.dbUser?.id) {
      return res.status(404).json({ message: "Endpoint not found" });
    }
    const replayHeaders = headers ?? JSON.parse(webhook.headers);
    const replayBody = body ?? webhook.body;
    let replayResponse;
    try {
        const response=await fetch(replayUrl,{
            method:"POST",
            headers:replayHeaders,
            body:replayBody
        })
        const responseText=await response.text(); 
        replayResponse={
            status:response.status,
            body:responseText,
        }

        return res.status(200).json({
            message: "Webhook replayed successfully",
            ...replayResponse,
          });
        
    } catch (fetchError) {
        return res.status(200).json({
            message: "Replay failed — could not reach target URL",
            error: String(fetchError),
          });
    }
  
  
  
  
  
  
  
  
  } catch (error) {
    res.status(500).json({ message: "Failed to replay webhooks" });
  }
};
