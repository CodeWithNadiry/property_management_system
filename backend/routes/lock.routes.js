import { Router } from "express";
import {
  create,
  getAll,
  remove,
  update,
} from "../controllers/lock.controller.js";
import { isAuth } from "../middleware/isAuth.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { createLockSchema } from "../schemas/lock.schema.js";

const router = Router();

router.post("/", validateRequest(createLockSchema), isAuth, create);
router.get("/", isAuth, getAll);
router.patch("/:id", isAuth, update);
router.delete("/:id", isAuth, remove);

export default router;
