import Room from "../models/room.model.js";
import User from "../models/user.model.js";
import Lock from "../models/lock.model.js";
import RoomLock from "../models/roomLock.model.js";

export const getDashboardStats = async (req, res, next) => {
  const { property_id } = req.query;

  try {
    const filter = property_id ? { property_id } : {};

    const totalRooms = await Room.count({ where: filter });

    const totalLocks = await Lock.count({ where: filter });

    const totalUsers = await User.count({ where: filter });

    const totalConnections = await RoomLock.count({where: filter})
    
    res.status(200).json({
      totalRooms,
      totalLocks,
      totalUsers,
      totalConnections
    });
  } catch (err) {
    err.statusCode ||= 500;
    next(err);
  }
};
