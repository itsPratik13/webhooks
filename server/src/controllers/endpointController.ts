import { PrismaClient,Prisma } from "../generated/prisma/client.js";
import { Request, Response } from "express";
import crypto from "crypto";
const prisma = new PrismaClient();

export const getEndpoints = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const endpoints = await prisma.endpoint.findMany();
    res.status(200).json(endpoints);
    console.table(endpoints);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch the endpoints:", error });
  }
};

export const getWebHooksById=async (req:Request, res:Response)=>{
  try {
     const {id}=req.params;
     const endpointId = Number(id);
     const limit=Number(req.query.limit)||20;
     const page=Number(req.query.page)||1;
     if(isNaN(endpointId)){
      return res.status(400).json({message:"Invalid endpoint ID"});
     }
     const webhooks=await prisma.response.findMany({
      where:{
        endpointId:endpointId
      },
      orderBy:{
        receivedAt:"desc"
      },
      take:limit,
      skip:(page-1)*limit
     })
     console.log(webhooks);
     res.status(200).json(webhooks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch the webhooks:", error });
    
  }
}

export const generateToken = async (req: Request, res: Response) => {
  const maxRetries = 5;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const token = crypto.randomBytes(24).toString("base64url");

      const endpoint = await prisma.endpoint.create({
        data: { token },
      });
      console.log(endpoint);
      return res.status(201).json({ endpoint });
    } catch (error) {
      if(error instanceof Prisma.PrismaClientKnownRequestError && error.code==="P2002"){
        continue;
      }
       console.log(error);
       return res.status(500).json({ message: "Failed to generate token"});
    }
  }
  return res.status(500).json({
    message: "Failed to generate a unique token after multiple attempts",
  });
};
