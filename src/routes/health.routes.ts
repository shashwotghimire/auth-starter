import { Router } from "express";
import { healthCheck } from "../controllers/health/healthcheck.controller";

const router = Router();

router.get("/", healthCheck);

export default router;
