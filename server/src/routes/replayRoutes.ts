import { Router } from "express";
import { replayWebhooks } from "../controllers/replayController.js";

const router=Router();
router.post("/:responseId/replay",replayWebhooks);