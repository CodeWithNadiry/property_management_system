import {
  assignLockService,
  deleteConnectionService,
  findConnectionByLock,
  findConnectionByRoom,
  getAllConnectionsService,
} from "../services/roomLock.services.js";

export async function assignLock(req, res, next) {
  try {
    const { room_id, lock_id, property_id } = req.body;

    const roomUsed = await findConnectionByRoom(room_id);
    if (roomUsed)
      return res.status(422).json({ message: "Room already has a lock" });

    const lockUsed = await findConnectionByLock(lock_id);
    if (lockUsed)
      return res.status(422).json({ message: "Lock already assigned" });

    const conn = await assignLockService({ room_id, lock_id, property_id });
    res.json({ connection: conn });
  } catch (err) {
    next(err);
  }
}

export async function unassignLock(req, res, next) {
  try {
    const conn = await deleteConnectionService(req.body.lock_id);
    if (!conn) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Unassigned" });
  } catch (err) {
    next(err);
  }
}

export async function getAllConnections(req, res, next) {
  try {
    let filter = {};

    if (req.userRole === "staff") filter.property_id = req.userPropertyId;
    if (req.userRole === "superadmin" && req.query.property_id) {
      filter.property_id = req.query.property_id;
    }

    const connections = await getAllConnectionsService(filter);
    res.json(connections);
  } catch (err) {
    next(err);
  }
}