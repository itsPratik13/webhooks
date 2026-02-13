import { Router } from "express";
import {
  deleteEndpoint,
  generateToken,
  getEndpoints,
  getEndpointById,
  getWebHooksById,
} from "../controllers/endpointController.js";

const router = Router();

router.post("/", generateToken);

router.get("/", getEndpoints);

router.get("/:id/webhooks", getWebHooksById);

router.get("/:id", getEndpointById);

router.delete("/:id", deleteEndpoint);

export default router;
