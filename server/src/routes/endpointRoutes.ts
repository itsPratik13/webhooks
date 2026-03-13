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
import { replayWebhooks } from "../controllers/replayController.js";

const router = Router();


router.post("/", generateToken);

router.get("/", getEndpoints);

router.get("/:id/webhooks", getWebHooksById);

router.get("/:id", getEndpointById);

router.patch("/:id",updateEndpoint);

router.delete("/:id", deleteEndpoint);

router.post("/:responseId/replay", replayWebhooks);

export default router;
