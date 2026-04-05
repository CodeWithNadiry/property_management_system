import Room from "../models/room.model.js";
import UnitGroup from "../models/unitGroup.model.js";

export const createRoomService = async (data, property_id) => {
  const { room_number, floor, unit_group_id } = data;

  if (!unit_group_id) {
    throw new Error("Unit group ID is required");
  }

  // Check if the unit group exists
  const unitGroup = await UnitGroup.findByPk(unit_group_id);
  if (!unitGroup) {
    throw new Error("Unit group does not exist");
  }

  // Now safe to create the room
  await Room.create({
    room_number,
    floor,
    unit_group_id,
    property_id,
  });
};
export const getRoomsService = (filter = {}) =>
  Room.findAll({ where: filter, order: [["created_at", "DESC"]] });

export const updateRoomService = async (id, data, property_id) => {
  const { room_number, floor, unit_group_id } = data;
  const room = await Room.findByPk(id);
  if (!room) return null;

  if (unit_group_id) {
    const unitGroup = await UnitGroup.findByPk(unit_group_id);
    if (!unitGroup) throw new Error("Unit group does not exist");
  }

  await room.update({
    room_number,
    floor,
    unit_group_id,
    property_id,
  });

  return room;
};

export const deleteRoomService = async (id) => {
  const room = await Room.findByPk(id);
  if (!room) return null;
  await room.destroy();
  return room;
};
