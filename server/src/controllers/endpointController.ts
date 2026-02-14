import { PrismaClient, Prisma } from "../generated/prisma/client.js";
import { Request, Response } from "express";
import crypto from "crypto";
const prisma = new PrismaClient();

export const getEndpoints = async (req: Request, res: Response) => {
  try {
    const {
      search,
      page = "1",
      limit = "20",
      sort = "createdAt",
      order = "desc",
    } = req.query;

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.min(Number(limit), 100);

    // Build an empty array first
    const orConditions: any[] = [];

    if (search) {
      // Always check name
      orConditions.push({ name: { contains: String(search), mode: "insensitive" } });

      // Always check token
      orConditions.push({ token: { contains: String(search), mode: "insensitive" } });

      // Only check id if search is a valid number
      const searchNumber = Number(search);
      if (!isNaN(searchNumber)) {
        orConditions.push({ id: searchNumber });
      }
    }

    // If no search, leave 'where' undefined
    const WhereCondition = orConditions.length > 0 ? { OR: orConditions } : undefined;

    const endpoints = await prisma.endpoint.findMany({
      where: WhereCondition,
      orderBy: { [String(sort)]: order === "asc" ? "asc" : "desc" },
      include: { _count: { select: { responses: true } } },
      take: limitNumber,
      skip: (pageNumber - 1) * limitNumber,
    });

    const total = await prisma.endpoint.count({ where: WhereCondition });

    res.status(200).json({
      data: endpoints,
      meta: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch the endpoints:", error });
  }
};





export const getEndpointById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid endpoint ID" });
    }

    const endpoint = await prisma.endpoint.findUnique({
      where: {
        id: id,
      },
      include: {
        _count: {
          select: {
            responses: true,
          },
        },
      },
    });
    if (!endpoint) {
      return res.status(404).json({ message: "Endpoint not found" });
    }

    res.status(200).json(endpoint);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch the endpoints:", error });
  }
};
export const getWebHooksById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const endpointId = Number(id);
    const limit = (Number(req.query.limit) || 20, 100);
    const page = (Number(req.query.page) || 1, 1);
    if (isNaN(endpointId)) {
      return res.status(400).json({ message: "Invalid endpoint ID" });
    }
    const webhooks = await prisma.response.findMany({
      where: {
        endpointId: endpointId,
      },
      orderBy: {
        receivedAt: "desc",
      },
      take: limit,
      skip: (page - 1) * limit,
    });
    console.log(webhooks);
    res.status(200).json(webhooks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch the webhooks:", error });
  }
};
export const deleteEndpoint = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid endpoint ID" });
    }
    await prisma.endpoint.delete({
      where: {
        id: id,
      },
    });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: "Failed to delete endpoint" });
  }
};
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
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        continue;
      }
      console.log(error);
      return res.status(500).json({ message: "Failed to generate token" });
    }
  }
  return res.status(500).json({
    message: "Failed to generate a unique token after multiple attempts",
  });
};
