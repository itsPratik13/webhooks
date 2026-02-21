import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

import endPointRoutes from "./routes/endpointRoutes.js"
import webHookRoutes from "./routes/webhookRoutes.js"

dotenv.config()
const app = express();
const PORT = process.env.PORT || 8000;
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use("/endpoints",express.json(),endPointRoutes);
app.use("/webhook",webHookRoutes);

app.get("/health", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
