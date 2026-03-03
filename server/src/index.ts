import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { clerkMiddleware,requireAuth } from "@clerk/express";

import endPointRoutes from "./routes/endpointRoutes.js"
import webHookRoutes from "./routes/webhookRoutes.js"
import { UserExists } from "./middleware/checkUserExists.js";

dotenv.config()
const app = express();
const PORT = process.env.PORT || 8000;
app.set("trust proxy", true);
app.use(clerkMiddleware());
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use((req, res, next) => {
  console.log("Auth header:", req.headers.authorization);
  next();
});
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use("/endpoints",express.json(),requireAuth(),UserExists,endPointRoutes);
app.use("/webhook",webHookRoutes);

app.get("/health", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
