import { Op } from "sequelize";
import Reservation from "../models/reservation.model.js";
import Room from "../models/room.model.js";
import { updateRoomSchema } from "../schemas/room.schema.js";

import {
  createRoomService,
  deleteRoomService,
  getRoomsService,
  updateRoomService,
} from "../services/room.services.js";
import UnitGroup from "../models/unitGroup.model.js";

export async function createRoom(req, res, next) {
  try {
    const { property_id } = req.query;
    console.log("property id:", property_id);
    const value = req.body;
    const room = await createRoomService(value, property_id);

    res.status(201).json({ room });
  } catch (err) {
    err.statusCode ||= 500;
    next(err);
  }
}

export async function getRooms(req, res, next) {
  try {
    const filter = {};
    if (req.userRole === "staff") filter.property_id = req.userPropertyId;
    if (req.userRole === "superadmin" && req.query.property_id)
      filter.property_id = req.query.property_id;

    const rooms = await getRoomsService(filter);
    res.json({ rooms });
  } catch (err) {
    next(err);
  }
}

export async function getAvailableRooms(req, res, next) {
  try {
    const { check_in, check_out, property_id } = req.query;

    if (!check_in || !check_out || !property_id) {
      return res.status(400).json({
        message: "check_in, check_out, property_id are required",
      });
    }

    const rooms = await Room.findAll({
      where: { property_id },
      include: [
        {
          model: Reservation,
          required: false, // Sequelize will include rooms even if they have no reservations that match the where condition.
          where: {
            status: { [Op.in]: ["pending", "confirmed", "checked_in"] },
            [Op.and]: [
              { check_in: { [Op.lt]: check_out } },
              { check_out: { [Op.gt]: check_in } },
            ],
          },
        },
        {
          model: UnitGroup,
          attributes: ["type", "price_per_night"],
        },
      ],
    });

    // {
    //   "id": 1,
    //   "room_number": "101",
    //   "status": "available",
    //   "UnitGroup": {
    //     "id": 2,
    //     "type": "double",
    //     "price_per_night": "5000.00"
    //   }
    // }

    const availableRooms = rooms.filter(
      (room) => room.Reservations.length === 0,
    );

    res.status(200).json({ availableRooms });
  } catch (error) {
    next(error);
  }
}

export async function updateRoom(req, res, next) {
  try {
    const { property_id } = req.query;
    const { error, value } = updateRoomSchema.validate(req.body);
    if (error) throw new Error(error.details[0].message);

    const room = await updateRoomService(req.params.id, value, property_id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    res.json({ room });
  } catch (err) {
    next(err);
  }
}

export async function deleteRoom(req, res, next) {
  const room = await deleteRoomService(req.params.id);
  if (!room) return res.status(404).json({ message: "Room not found" });
  res.json({ message: "Room deleted" });
}
