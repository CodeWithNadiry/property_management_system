import { Router } from "express";
import { isAuth } from "../middleware/isAuth.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  assignLockSchema,
  editAssignLockSchema,
} from "../schemas/roomLock.schema.js";
import {
  create,
  getAll,
  getLocksUnAssigned,
  getRoomsUnAssigned,
  remove,
  update,
} from "../controllers/roomLock.controller.js";

const router = Router();

router.get("/", isAuth, getAll);
router.get("/unassigned-locks", getLocksUnAssigned);
router.get("/unassigned-rooms", getRoomsUnAssigned);

router.post("/assign", validateRequest(assignLockSchema), isAuth, create);
router.patch(
  "/edit-assign/:id",
  validateRequest(editAssignLockSchema),
  isAuth,
  update,
);
router.delete("/unassign/:id", isAuth, remove);

export default router;
