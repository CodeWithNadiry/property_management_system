import { Op } from "sequelize";
import Lock from "../models/lock.model.js";
import Room from "../models/room.model.js";
import RoomLock from "../models/roomLock.model.js";
import { AppError } from "../utils/AppError.js";

export const roomLockService = {
  async createConnection(data, property_id) {
    const { room_id, lock_id } = data;

    const room = await Room.findByPk(room_id);
    if (!room) throw new AppError("Room not found", 404);

    const lock = await Lock.findByPk(lock_id);
    if (!lock) throw new AppError("Lock not found", 404);

    const roomAlreadyUsed = await RoomLock.findOne({ where: { room_id } });
    if (roomAlreadyUsed) throw new AppError("Room already has a lock", 422);

    const lockAlreadyUsed = await RoomLock.findOne({ where: { lock_id } });
    if (lockAlreadyUsed) throw new AppError("Lock already assigned", 422);

    return await RoomLock.create({ room_id, lock_id, property_id });
  },

  async updateConnection(id, data, property_id) {
    const { room_id, lock_id } = data;

    const connection = await RoomLock.findByPk(id);
    if (!connection) throw new AppError("Connection not found", 404);

    // ignore current record while checking
    const roomUsed = await RoomLock.findOne({
      where: { room_id, id: { [Op.ne]: id } },
    });

    if (roomUsed) throw new AppError("Room already has a lock", 422);

    const lockUsed = await RoomLock.findOne({
      where: { lock_id, id: { [Op.ne]: id } },
    });

    if (lockUsed) throw new AppError("Lock already assigned", 422);

    const room = await Room.findByPk(room_id);
    if (!room) throw new AppError("Room not found", 404);

    const lock = await Lock.findByPk(lock_id);
    if (!lock) throw new AppError("Lock not found", 404);

    await connection.update({ room_id, lock_id, property_id });

    return connection;
  },

  async deleteConnection(id) {
    const conn = await RoomLock.findByPk(id);
    if (!conn) throw new AppError("Connection not found", 404);

    await conn.destroy();
    return conn;
  },

  async getAllConnections(filter = {}) {
    return RoomLock.findAll({
      where: filter,
      order: [["created_at", "DESC"]],
    });
  },

  async getUnAssignedLocks(property_id) {
    if (!property_id) throw new AppError("property_id is required", 400);

    const locks = await Lock.findAll({
      where: { property_id },
      include: [
        {
          model: RoomLock,
          required: false,
          where: { property_id },
        },
      ],
    });

    const unAssignedLocks = locks.filter((lock) => !lock.RoomLock);

    return unAssignedLocks;
  },

  async getUnAssignedRooms(property_id) {
    if (!property_id) throw new AppError("property_id is required", 400);

    const rooms = await Room.findAll({
      where: { property_id },
      include: [RoomLock],
    });

    const unAssignedRooms = rooms.filter((room) => !room.RoomLock);

    return unAssignedRooms;
  },
};

// 🔹 Op.ne = "not equal"
// used to ignore current record while checking duplicates
