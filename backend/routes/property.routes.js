import { Router } from "express";

import { isAuth } from "../middleware/isAuth.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { isSuperAdmin } from "../middleware/isSuperAdmin.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { createPropertySchema } from "../schemas/property.schema.js";
import {
  create,
  getAll,
  remove,
  update,
} from "../controllers/property.controller.js";

const router = Router();

router.post(
  "/",
  validateRequest(createPropertySchema),
  isAuth,
  isSuperAdmin,
  create,
);

router.get("/", isAuth, isAdmin, getAll);

router.patch("/:id", isAuth, isAdmin, update);

router.delete("/:id", isAuth, isSuperAdmin, remove);

export default router;
