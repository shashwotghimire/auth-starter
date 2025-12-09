import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/errorhandler.middleware";

// routes import
import healthRoutes from "./routes/health.routes";

const app = express();

app.use(express.json());
app.use(cors());

// routes
app.use("/api/check", healthRoutes);

app.use(errorHandler);
export default app;
