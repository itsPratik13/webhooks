import { Router } from "express";
import {
  deleteEndpoint,
  generateToken,
  getEndpoints,
  getEndpointById,
  getWebHooksById,
  updateEndpoint,
} from "../controllers/endpointController.js";
import { requireAuth } from "@clerk/express";

const router = Router();


router.post("/", generateToken);

router.get("/", getEndpoints);

router.get("/:id/webhooks", getWebHooksById);

router.get("/:id", getEndpointById);

router.patch("/:id",updateEndpoint);

router.delete("/:id", deleteEndpoint);

export default router;
