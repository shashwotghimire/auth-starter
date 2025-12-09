import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/errorhandler.middleware";

// routes import
import healthRoutes from "./routes/health.routes";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
const app = express();

app.use(express.json());
app.use(cors());

// routes
app.use("/api/check", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.use(errorHandler);
export default app;
