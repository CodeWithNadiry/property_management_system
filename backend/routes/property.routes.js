import { Router } from "express";
import {
  createProperty,
  getProperties,
  updateProperty,
  deleteProperty,
} from "../controllers/property.controller.js";

import { isAuth } from "../middleware/isAuth.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { isSuperAdmin } from "../middleware/isSuperAdmin.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { createPropertySchema } from "../schemas/property.schema.js";

const router = Router();

router.post("/", validateRequest(createPropertySchema), isAuth, isSuperAdmin, createProperty);

router.get("/", isAuth, isAdmin, getProperties);

router.patch("/:id", isAuth, isAdmin, updateProperty);

router.delete("/:id", isAuth, isSuperAdmin, deleteProperty);

export default router;