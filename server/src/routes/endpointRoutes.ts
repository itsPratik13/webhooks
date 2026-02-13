import { Router } from "express";
import { generateToken, getEndpoints, getWebHooksById } from "../controllers/endpointController.js";

const router=Router();

router.get("/",getEndpoints);
router.get("/:id/webhooks",getWebHooksById);
router.post("/generate-token",generateToken);

export default router;