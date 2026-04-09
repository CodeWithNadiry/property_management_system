import { Op } from "sequelize";
import Reservation from "../models/reservation.model.js";
import Room from "../models/room.model.js";
import UnitGroup from "../models/unitGroup.model.js";
import Passcode from "../models/passcode.model.js";
import ConfirmationForm from "../models/confirmationForm.model.js";
import { generateCode } from "../utils/generateCode.js";
import { sendEmail } from "../utils/sendEmail.js";
import {
  confirmReservationEmail,
  passcodeEmail,
} from "../utils/emailTemplate.js";
import { AppError } from "../utils/AppError.js";
import jwt from "jsonwebtoken";

export const reservationService = {
  async createReservation(data, property_id) {
    const { name, email, phone, check_in, check_out, room_id } = data;

    const room = await Room.findOne({ where: { id: room_id, property_id } });
    if (!room) throw new AppError("Room not found", 404);

    const existingReservation = await Reservation.findOne({
      where: {
        room_id: room.id,
        status: { [Op.in]: ["pending", "confirmed", "checked_in"] },
        [Op.and]: [
          { check_in: { [Op.lt]: check_out } }, // if this true
          { check_out: { [Op.gt]: check_in } }, // if this false.... TRUE && FALSE = FALSE /// no overlap
        ],
      },
    });

    if (existingReservation)
      throw new AppError("Room already booked for selected dates", 422);

    const unitGroup = await UnitGroup.findByPk(room.unit_group_id);
    if (!unitGroup) throw new AppError("Unit group not found", 404);

    const nights =
      (new Date(check_out) - new Date(check_in)) / (1000 * 60 * 60 * 24);

    const total_price = nights * parseFloat(unitGroup.price_per_night);

    const reservation = await Reservation.create({
      name,
      email,
      phone,
      check_in,
      check_out,
      property_id,
      room_id,
      total_price,
    });

    const passcode = await Passcode.create({
      reservation_id: reservation.id,
      room_id,
      code: generateCode(),
      valid_from: check_in,
      valid_until: check_out,
    });

    try {
      await sendEmail({
        to: reservation.email,
        subject: "Reservation Confirmation",
        html: confirmReservationEmail(reservation),
      });
    } catch (err) {
      console.log("Email failed:", err.message);
    }

    return { reservation, passcode };
  },

  async updateReservation(filter, data) {
    const reservation = await Reservation.findOne({ where: filter });
    if (!reservation) throw new AppError("Reservation not found", 404);

    await reservation.update(data);
    return reservation;
  },

  async getReservations(filter = {}) {
    return Reservation.findAll({
      where: filter,
      order: [["created_at", "DESC"]],
    });
  },

  async getReservation(filter) {
    const reservation = await Reservation.findOne({ where: filter });
    if (!reservation) throw new AppError("Reservation not found", 404);
    return reservation;
  },

  async cancelReservation(id) {
    const reservation = await Reservation.findByPk(id);
    if (!reservation) throw new AppError("Reservation not found", 404);

    if (reservation.status !== "confirmed")
      throw new AppError("Only confirmed reservations can be cancelled", 400);

    await reservation.update({ status: "cancelled" });

    await Room.update(
      { status: "available" },
      { where: { id: reservation.room_id } },
    );

    await Passcode.update(
      { status: "expired" },
      { where: { reservation_id: id } },
    );

    return { reservation };
  },

  async guestConfirm(data, id) {
    const reservation = await Reservation.findByPk(id, {
      // get the reservation by its id and also include the related ConfirmationForm(but only the id and status fields.)
      include: [ConfirmationForm],
    });

    if (!reservation || reservation.status !== "pending")
      throw new AppError("Reservation not available", 400);

    if (reservation.ConfirmationForm)
      throw new AppError("Already confirmed", 400);

    const confirmationForm = await ConfirmationForm.create({
      reservation_id: id,
      ...data,
    });

    await reservation.update({ status: "confirmed" });

    await Room.update(
      { status: "reserved" },
      { where: { id: reservation.room_id } },
    );

    return confirmationForm;
  },

  async guestCheckIn(token) {
    if (!token) throw new AppError("Token is required", 400);

    const decoded = jwt.verify(token, "super");

    const reservation = await Reservation.findByPk(decoded.reservation_id, {
      include: [ConfirmationForm],
    });

    if (!reservation) throw new AppError("Reservation not available", 404);

    const passcode = await Passcode.findOne({
      where: { reservation_id: reservation.id },
    });

    if (!passcode) throw new AppError("Passcode not found", 404);

    if (!reservation.ConfirmationForm)
      throw new AppError("Confirmation required before check-in", 400);

    if (reservation.status === "checked_in") {
      return { message: "Already checked in", passcode: passcode.code };
    }

    await reservation.update({ status: "checked_in" });

    try {
      await sendEmail({
        to: reservation.email,
        subject: "Checked in",
        html: passcodeEmail({
          name: reservation.name,
          passcode: passcode.code,
        }),
      });
    } catch (err) {
      console.log("Email failed");
    }

    return { message: "Checked in successfully", passcode: passcode.code };
  },

  async guestFrontDeskCheckIn(reservation_id) {
    const reservation = await Reservation.findByPk(reservation_id, {
      include: [Passcode],
    });

    if (!reservation) throw new AppError("Reservation not found", 404);

    if (reservation.status === "checked_in") {
      return {
        message: "Already checked in",
        passcode: reservation.Passcode.code,
      };
    }

    await reservation.update({ status: "checked_in" });

    return {
      message: "Checked in successfully",
      passcode: reservation.Passcode.code,
    };
  },

  async guestCheckOut(id) {
    const reservation = await Reservation.findByPk(id);

    if (!reservation || reservation.status !== "checked_in")
      throw new AppError("Reservation is not checked in", 400);

    await reservation.update({ status: "checked_out" });

    await Room.update(
      { status: "available" },
      { where: { id: reservation.room_id } },
    );

    await Passcode.update(
      { status: "expired" },
      { where: { reservation_id: id } },
    );

    return reservation;
  },

  async guestNoShow(id) {
    const reservation = await Reservation.findByPk(id);

    if (!reservation) throw new AppError("Reservation not found", 404);

    if (reservation.status !== "confirmed")
      throw new AppError("Only confirmed reservations allowed", 400);

    await reservation.update({ status: "noshow" });

    await Passcode.update(
      { status: "expired" },
      { where: { reservation_id: id } },
    );

    return reservation;
  },

  async findReservationById(id) {
    const reservation = await Reservation.findByPk(id);
    if (!reservation) throw new AppError("Reservatoin not found", 404);
    return reservation;
  },
};
