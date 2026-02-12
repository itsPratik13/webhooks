import { Router } from "express";
import { generateToken, getEndpoints } from "../controllers/endpointController.js";

const router=Router();

router.get("/",getEndpoints);
router.post("/generate-token",generateToken);

export default router;