import {
  loginUser,
  registerUser,
  verifyEmail,
} from "../controllers/auth/auth.controller";
import { Router } from "express";

const router = Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/verify/:token", verifyEmail);

export default router;
