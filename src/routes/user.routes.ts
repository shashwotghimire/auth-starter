import { Router } from "express";
import { getUser } from "../controllers/user/user.controller";
import { protect } from "../middleware/protect.middleware";

const router = Router();

router.get("/me", protect as any, getUser as any);

export default router;
