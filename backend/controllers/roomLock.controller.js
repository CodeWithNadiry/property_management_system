// controllers/roomLock.controller.js
import { Op } from "sequelize";
import RoomLock from "../models/roomLock.model.js";
import Room from "../models/room.model.js";
import Lock from "../models/lock.model.js";
import {
  assignLockService,
  deleteConnectionService,
  findConnectionByLock,
  findConnectionByRoom,
  getAllConnectionsService,
} from "../services/roomLock.services.js";

export async function assignLock(req, res, next) {
  try {
    const { property_id } = req.query;
    const { room_id, lock_id } = req.body;

    const room = await Room.findByPk(room_id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    const lock = await Lock.findByPk(lock_id);
    if (!lock) return res.status(404).json({ message: "Lock not found" });

    const roomUsed = await findConnectionByRoom(room_id);
    if (roomUsed)
      return res.status(422).json({ message: "Room already has a lock" });

    const lockUsed = await findConnectionByLock(lock_id);
    if (lockUsed)
      return res.status(422).json({ message: "Lock already assigned" });

    const conn = await assignLockService({ room_id, lock_id, property_id });
    res.status(201).json({ connection: conn });
  } catch (err) {
    next(err);
  }
}

export async function editAssignLock(req, res, next) {
  try {
    const { room_id, lock_id } = req.body;
    const { property_id } = req.query;
    const { id } = req.params;

    const connection = await RoomLock.findByPk(id);
    if (!connection)
      return res.status(404).json({ message: "Connection not found" });

    const roomUsed = await RoomLock.findOne({
      where: { room_id, id: { [Op.ne]: id } }, // not equal to
    });

    if (roomUsed)
      return res.status(422).json({ message: "Room already has a lock" });

    const lockUsed = await RoomLock.findOne({
      where: { lock_id, id: { [Op.ne]: id } },
    });
    if (lockUsed)
      return res
        .status(422)
        .json({ message: "Lock already assigned to a room" });

    const room = await Room.findByPk(room_id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    const lock = await Lock.findByPk(lock_id);
    if (!lock) return res.status(404).json({ message: "Lock not found" });

    connection.room_id = room_id;
    connection.lock_id = lock_id;
    connection.property_id = property_id;

    await connection.save();

    res.status(200).json({ connection });
  } catch (error) {
    next(error);
  }
}

export async function unassignLock(req, res, next) {
  try {
    const { lock_id } = req.body;
    const conn = await deleteConnectionService(lock_id);
    if (!conn) return res.status(404).json({ message: "Connection not found" });

    res.status(200).json({ message: "Lock unassigned", connection: conn });
  } catch (err) {
    next(err);
  }
}

export async function getAllConnections(req, res, next) {
  try {
    let filter = {};

    if (req.userRole === "staff") filter.property_id = req.userPropertyId;
    if (req.userRole === "superadmin" && req.query.property_id)
      filter.property_id = req.query.property_id;

    const connections = await getAllConnectionsService(filter);
    res.status(200).json({connections});
  } catch (err) {
    next(err);
  }
}

export async function getUnAssignedLocks(req, res, next) {
  try {
    const { property_id } = req.query;

    if (!property_id) throw new Error("property_id is required,.");

    const locks = await Lock.findAll({
      where: { property_id },
      include: {
        model: RoomLock,
        required: false, // required: false → even if a lock has no RoomLock, still include it
        where: { property_id },
      },
    });

    if (!locks) throw new Error("locks not found.");

    console.log('Locks: ', locks)
    const unAssignedLocks = locks.filter((lock) => {
      if (!lock.RoomLock) {
        return lock;
      }
    });
    res.status(200).json( {unAssignedLocks} );
  } catch (error) {
    next(error);
  }
}


export async function getUnAssignedRooms(req, res, next) {
  try {
    const {property_id} = req.query
    if (!property_id) throw new Error("property_id is required,.");

    const rooms = await Room.findAll({
      where: {property_id},
      include: [RoomLock]
    })

    if (!rooms) throw new Error('Rooms not found.')

    const unAssignedRooms = rooms.filter(room => {
      if (!room.RoomLock) {
        return room;
      }
    })

    console.log("🚀 ~ getUnAssignedRooms ~ rooms:", rooms)
    res.status(200).json({unAssignedRooms})
  } catch (error) {
    next(error)
  }
}