import { Op } from "sequelize";
import Reservation from "../models/reservation.model.js";
import Room from "../models/room.model.js";
import { updateRoomSchema } from "../schemas/room.schema.js";
import { roomService } from "../services/room.services.js";
import UnitGroup from "../models/unitGroup.model.js";

export async function create(req, res, next) {
  try {
    const { property_id } = req.query;
    const value = req.body;

    const room = await roomService.createRoom(value, property_id);

    res.status(201).json({ room });
  } catch (err) {
    err.statusCode ||= 500;
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

    const rooms = await roomService.getRooms(filter);

    res.json({ rooms });
  } catch (err) {
    next(err);
  }
}

export async function getOne(req, res, next) {
  try {
    const room = await roomService.getRoom(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json({ room });
  } catch (err) {
    next(err);
  }
}

export async function getAllAvailables(req, res, next) {
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
          required: false,
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

    const availableRooms = rooms.filter(
      (room) => room.Reservations.length === 0
    );

    res.status(200).json({ availableRooms });
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const { property_id } = req.query;
    const { error, value } = updateRoomSchema.validate(req.body);

    if (error) throw new Error(error.details[0].message);

    const room = await roomService.updateRoom(
      req.params.id,
      value,
      property_id
    );

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json({ room });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const room = await roomService.deleteRoom(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json({ message: "Room deleted" });
  } catch (error) {
    next(error);
  }
}