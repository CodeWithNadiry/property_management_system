import { Router } from "express";
import { login } from "../controllers/auth.controller.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { loginSchema } from "../schemas/auth.schema.js";

const router = Router();

router.post("/login", validateRequest(loginSchema), login);

export default router;
