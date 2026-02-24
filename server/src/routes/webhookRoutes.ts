import { Router } from "express";
import express from "express";
import { logWebHook } from "../controllers/webhookController.js";

const router = Router();

router.all("/:token", express.raw({ type: "*/*", limit: "10mb" }), logWebHook);

export default router;
