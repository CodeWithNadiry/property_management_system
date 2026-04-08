import Reservation from "../models/reservation.model.js";
import Room from "../models/room.model.js";
import UnitGroup from "../models/unitGroup.model.js";

export const roomService = {
  async createRoom(data, property_id) {
    const { room_number, floor, unit_group_id } = data;

    if (!unit_group_id) {
      throw new Error("Unit group ID is required");
    }

    const unitGroup = await UnitGroup.findByPk(unit_group_id);
    if (!unitGroup) {
      throw new Error("Unit group does not exist");
    }

    const room = await Room.create({
      room_number,
      floor,
      unit_group_id,
      property_id,
    });

    return room;
  },

  async getRooms(filter = {}) {
    return await Room.findAll({
      where: filter,
      order: [["created_at", "DESC"]],
    });
  },

  async getRoom(id) {
    const room = await Room.findByPk(id, {
      include: [UnitGroup],
    });

    if (!room) return null;
    return room;
  },

  async updateRoom(id, data, property_id) {
    const { room_number, floor, unit_group_id } = data;

    const room = await Room.findByPk(id);
    if (!room) return null;

    if (unit_group_id) {
      const unitGroup = await UnitGroup.findByPk(unit_group_id);
      if (!unitGroup) {
        throw new Error("Unit group does not exist");
      }
    }

    await room.update({
      room_number,
      floor,
      unit_group_id,
      property_id,
    });

    return room;
  },

  async deleteRoom(id) {
    const room = await Room.findByPk(id);
    if (!room) return null;

    const reservation = await Reservation.findOne({
      where: { room_id: room.id },
    });

    if (reservation) {
      throw new Error("this room is reserved, cannot delete it.");
    }

    await room.destroy();
    return room;
  },
};
