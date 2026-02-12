import { Router } from "express";
import express from "express";
import { logWebHook } from "../controllers/webhookController.js";

const router= Router();

router.post("/:token",express.raw({type:"*/*"}),logWebHook);

export default router;