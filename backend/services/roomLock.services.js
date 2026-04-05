import RoomLock from "../models/roomLock.model.js";

export const assignLockService = (data) => RoomLock.create(data);
export const findConnectionByRoom = (room_id) => RoomLock.findOne({ where: { room_id } });
export const findConnectionByLock = (lock_id) => RoomLock.findOne({ where: { lock_id } });

export const deleteConnectionService = async (lock_id) => {
  const conn = await RoomLock.findOne({ where: { lock_id } });
  if (!conn) return null;
  await conn.destroy();
  return conn;
};

export const getAllConnectionsService = (filter = {}) =>
  RoomLock.findAll({ where: filter, order: [["created_at", "DESC"]] });