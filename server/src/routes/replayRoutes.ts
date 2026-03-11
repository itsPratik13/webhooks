import { Router } from "express";
import { replayWebhooks } from "../controllers/replayController.js";

const router=Router();
router.use("/:responseId/replay",replayWebhooks);