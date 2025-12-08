import express, { Request, Response } from "express";
import cors from "cors";

// routes
import checkRoutes from "./routes/check.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/check", checkRoutes);

app.use(errorHandler);
export default app;
