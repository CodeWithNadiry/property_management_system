// services/roomLock.services.js
import RoomLock from "../models/roomLock.model.js";

export const assignLockService = async ({ room_id, lock_id, property_id }) => {
  const conn = await RoomLock.create({ room_id, lock_id, property_id });
  return conn;
};

export const findConnectionByRoom = (room_id) =>
  RoomLock.findOne({ where: { room_id } });

export const findConnectionByLock = (lock_id) =>
  RoomLock.findOne({ where: { lock_id } });

export const deleteConnectionService = async (lock_id) => {
  const conn = await RoomLock.findOne({ where: { lock_id } });
  if (!conn) return null;
  await conn.destroy();
  return conn;
};

export const getAllConnectionsService = (filter = {}) =>
  RoomLock.findAll({ where: filter, order: [["created_at", "DESC"]] });