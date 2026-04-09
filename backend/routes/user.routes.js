import { Router } from "express";
import {
  create,
  getAll,
  remove,
  update,
} from "../controllers/user.controller.js";
import { isAuth } from "../middleware/isAuth.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { createUserSchema } from "../schemas/user.schema.js";

const router = Router();

router.post("/", validateRequest(createUserSchema), isAuth, isAdmin, create);

router.get("/", isAuth, isAdmin, getAll);

router.patch("/:id", isAuth, isAdmin, update);

router.delete("/:id", isAuth, isAdmin, remove);

export default router;
