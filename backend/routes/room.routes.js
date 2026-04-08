import { Router } from "express";
import { create, getAll, update, remove, getAllAvailables } from "../controllers/room.controller.js";
import { isAuth } from "../middleware/isAuth.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { createRoomSchema } from "../schemas/room.schema.js";

const router = Router();

router.post("/",validateRequest(createRoomSchema), isAuth, create);

router.get("/", isAuth, getAll);
router.get("/available", getAllAvailables);
router.patch("/:id", isAuth, update);
router.delete("/:id", isAuth, remove);

export default router;