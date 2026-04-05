import { Router } from "express";
import { createRoom, getRooms, updateRoom, deleteRoom, getAvailableRooms } from "../controllers/room.controller.js";
import { isAuth } from "../middleware/isAuth.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { createRoomSchema } from "../schemas/room.schema.js";

const router = Router();

router.post("/",validateRequest(createRoomSchema), isAuth, createRoom);

router.get("/", isAuth, getRooms);
router.get("/available", getAvailableRooms);
router.patch("/:id", isAuth, updateRoom);
router.delete("/:id", isAuth, deleteRoom);

export default router;