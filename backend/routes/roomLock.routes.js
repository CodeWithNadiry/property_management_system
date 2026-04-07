import { Router } from "express";
import { assignLock, unassignLock, getAllConnections, editAssignLock, getUnAssignedLocks, getUnAssignedRooms } from "../controllers/roomLock.controller.js";
import { isAuth } from "../middleware/isAuth.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { assignLockSchema, editAssignLockSchema } from "../schemas/roomLock.schema.js";

const router = Router();

router.get("/", isAuth, getAllConnections);
router.get('/unassigned-locks', getUnAssignedLocks)
router.get('/unassigned-rooms', getUnAssignedRooms)

router.post("/assign", validateRequest(assignLockSchema), isAuth, assignLock);
router.patch('/edit-assign/:id', validateRequest(editAssignLockSchema), isAuth, editAssignLock)
router.post("/unassign", isAuth, unassignLock);

export default router;