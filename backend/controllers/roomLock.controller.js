import { roomLockService } from "../services/roomLock.services.js";

const {
  createConnection,
  updateConnection,
  deleteConnection,
  getAllConnections,
  getUnAssignedLocks,
  getUnAssignedRooms,
} = roomLockService;

export async function create(req, res, next) {
  try {
    const { property_id } = req.query;

    const connection = await createConnection(req.body, property_id);

    res.status(201).json({ connection });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const { property_id } = req.query;
    const { id } = req.params;

    const connection = await updateConnection(id, req.body, property_id);

    res.status(200).json({ connection });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const { id } = req.params;

    const connection = await deleteConnection(id);

    res.status(200).json({
      message: "Lock unassigned",
      connection,
    });
  } catch (err) {
    next(err);
  }
}

export async function getAll(req, res, next) {
  try {
    const filter = {};

    if (req.userRole === "staff") {
      filter.property_id = req.userPropertyId;
    }

    if (req.userRole === "superadmin" && req.query.property_id) {
      filter.property_id = req.query.property_id;
    }

    const connections = await getAllConnections(filter);

    res.status(200).json({ connections });
  } catch (err) {
    next(err);
  }
}

export async function getLocksUnAssigned(req, res, next) {
  try {
    const { property_id } = req.query;

    const unAssignedLocks = await getUnAssignedLocks(property_id);

    res.status(200).json({ unAssignedLocks });
  } catch (err) {
    next(err);
  }
}

export async function getRoomsUnAssigned(req, res, next) {
  try {
    const { property_id } = req.query;

    const unAssignedRooms = await getUnAssignedRooms(property_id);

    res.status(200).json({ unAssignedRooms });
  } catch (err) {
    next(err);
  }
}
