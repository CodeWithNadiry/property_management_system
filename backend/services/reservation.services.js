import { Op } from "sequelize";
import Reservation from "../models/reservation.model.js";
import Room from "../models/room.model.js";
import UnitGroup from "../models/unitGroup.model.js";
import Passcode from "../models/passcode.model.js";
import ConfirmationForm from "../models/confirmationForm.model.js";
import { generateCode } from "../utils/generateCode.js";
import { sendEmail } from "../utils/sendEmail.js";
import { confirmReservationEmail } from "../utils/emailTemplate.js";

// ========= Helpers =============== //

const getRoom = async (room_id, property_id) => {
  const room = await Room.findOne({ where: { id: room_id, property_id } });
  if (!room) throw new Error("Room not found");
  return room;
};

const checkAvailability = async (room, check_in, check_out) => {
  const existingReservation = await Reservation.findOne({
    where: {
      room_id: room.id,
      status: {
        [Op.in]: ["pending", "confirmed", "checked_in"],
      },
      [Op.and]: [
        { check_in: { [Op.lt]: check_out } },
        { check_out: { [Op.gt]: check_in } },
      ],
    },
  });

  //   existing.check_in  <  new.check_out
  // AND
  // existing.check_out >  new.check_in

  if (existingReservation) {
    throw new Error("Room already booked for selected dates");
  }
};

const calculatePrice = async (room, check_in, check_out) => {
  const unitGroup = await UnitGroup.findOne({
    where: { id: room.unit_group_id },
  });
  if (!unitGroup) throw new Error("Unit group not found");
  const nights =
    (new Date(check_out) - new Date(check_in)) / (1000 * 60 * 60 * 24);
  return nights * parseFloat(unitGroup.price_per_night);
};

const createPasscode = async (reservation, room_id, check_in, check_out) => {
  return await Passcode.create({
    reservation_id: reservation.id,
    room_id,
    code: generateCode(),
    valid_from: check_in,
    valid_until: check_out,
  });
};

const getReservationForConfirmation = async (reservation_id) => {
  const reservation = await Reservation.findByPk(reservation_id, {
    include: [ConfirmationForm],
  });
  if (!reservation || reservation.status !== "pending")
    throw new Error("Reservation not available for confirmation.");
  return reservation;
};

// const validatePasscode = async (reservation_id, passcode) => {
//   const passcodeRecord = await Passcode.findOne({ where: { reservation_id } });
//   if (!passcodeRecord || String(passcodeRecord.code) !== String(passcode)) throw new Error("Invalid passcode");
//   return passcodeRecord;
// };

const checkAlreadyConfirmed = (reservation) => {
  if (reservation.ConfirmationForm)
    throw new Error("Guest has already confirmed");
};

const createConfirmationForm = async (data, reservation_id) => {
  const { city, country, number_of_guests } = data;
  return await ConfirmationForm.create({
    reservation_id,
    city,
    country,
    number_of_guests,
  });
};

const updateCheckInStatus = async (reservation) => {
  await reservation.update({ status: "confirmed" });
  await Room.update(
    { status: "reserved" },
    { where: { id: reservation.room_id } },
  );
};

// ========= Services ========= //
export const createReservationService = async (data, property_id) => {
  const { name, email, phone, check_in, check_out, room_id } = data;

  const room = await getRoom(room_id, property_id);

  await checkAvailability(room, check_in, check_out);

  const total_price = await calculatePrice(room, check_in, check_out);

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

  const passcode = await createPasscode(
    reservation,
    room_id,
    check_in,
    check_out,
  );

  try {
    await sendEmail({
      to: reservation.email,
      subject: "Reservation Confirmed",
      html: confirmReservationEmail(reservation),
    });

    console.log("sending confirmation email.");
  } catch (error) {
    console.log(error);
  }
  return { reservation, passcode };
};
export async function updateReservationService(filter, updateData) {
  const reservation = await Reservation.findOne({
    where: filter,
  });

  if (!reservation) {
    const error = new Error("Reservation not found");
    error.statusCode = 404;
    throw error;
  }

  await reservation.update(updateData);

  return reservation;
}

export const cancelReservationService = async (reservation_id) => {
  const reservation = await Reservation.findOne({
    where: { id: reservation_id },
  });
  if (!reservation) throw new Error("Reservation not found");
  if (!["confirmed"].includes(reservation.status))
    throw new Error("Only confirmed reservations can be cancelled");
  reservation.status = "cancelled";
  await reservation.save();
  await Room.update(
    { status: "available" },
    { where: { id: reservation.room_id } },
  );
  await Passcode.update(
    { status: "expired" },
    { where: { reservation_id: reservation.id } },
  );
  return { reservation };
};

export const guestConfirmService = async (data, reservation_id) => {
  const reservation = await getReservationForConfirmation(reservation_id);
  checkAlreadyConfirmed(reservation);
  const confirmationForm = await createConfirmationForm(data, reservation_id);
  await updateCheckInStatus(reservation);
  return confirmationForm;
};

export const guestCheckOutService = async (reservation_id) => {
  const reservation = await Reservation.findByPk(reservation_id, {
    include: [ConfirmationForm],
  });

  if (!reservation || reservation.status !== "checked_in") {
    throw new Error("Reservation is not checked in already.");
  }

  reservation.status = "checked_out";
  await reservation.save();

  await Room.update(
    { status: "available" },
    { where: { id: reservation.room_id } },
  );

  await Passcode.update({ status: "expired" }, { where: { reservation_id } });

  return reservation;
};
