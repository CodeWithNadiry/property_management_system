import { Router } from "express";
import { createLock, getLocks, updateLock, deleteLock } from "../controllers/lock.controller.js";
import { isAuth } from "../middleware/isAuth.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { createLockSchema } from "../schemas/lock.schema.js";

const router = Router();

router.post("/", validateRequest(createLockSchema), isAuth, createLock);
router.get("/", isAuth, getLocks);
router.patch("/:id", isAuth, updateLock);
router.delete("/:id", isAuth, deleteLock);

export default router;