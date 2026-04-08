import { Op } from "sequelize";
import Reservation from "../models/reservation.model.js";
import { checkInEmail, checkOutEmail } from "../utils/emailTemplate.js";
import { sendEmail } from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";
import { reservationService } from "../services/reservation.services.js";
// By default, Sequelize assumes equality (e.g., id: 5 becomes WHERE id = 5). The Op object allows you to use other SQL comparisons and logical conditions:
console.log("running");
export const sendCheckInReminderEmails = async () => {
  try {
    const today = new Date();

    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0,
      0,
      0,
      0,
    );

    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
      999,
    );

    console.log("Running check-in email job...");
    console.log("Checking reservations between", startOfDay, "and", endOfDay);

    const reservations = await Reservation.findAll({
      where: {
        check_in: { [Op.between]: [startOfDay, endOfDay] },
        status: "confirmed",
      },
    });

    console.log("Reservations found:", reservations.length);

    await Promise.all(
      reservations.map(async (reservation) => {
        const token = jwt.sign(
          {
            email: reservation.email,
            reservation_id: reservation.id,
            check_in: reservation.check_in,
            check_out: reservation.check_out,
          },
          "super",
          { expiresIn: "1hr" },
        );

        try {
          await sendEmail({
            to: reservation.email,
            subject: "Check-In Reminder",
            html: checkInEmail(token),
          });

          console.log("Email sent to:", reservation.email);
        } catch (error) {
          console.error("Email failed for:", reservation.email, error);
        }
      }),
    );
  } catch (error) {
    console.error("Error in check-in email job:", error);
  }
};

export const sendCheckOutReminderEmails = async () => {
  try {
    const today = new Date();

    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0,
      0,
      0,
      0,
    );

    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
      999,
    );

    console.log("Running check-out email job...");
    console.log("Checking reservations between", startOfDay, "and", endOfDay);

    const reservations = await Reservation.findAll({
      where: {
        check_out: { [Op.between]: [startOfDay, endOfDay] },
        status: "checked_in",
      },
    });

    console.log("Reservations found:", reservations.length);

    // 🔥 Parallel execution with individual error handling
    await Promise.all(
      reservations.map(async (reservation) => {
        try {
          await reservationService.guestCheckOut(reservation.id);

          await sendEmail({
            to: reservation.email,
            subject: "Check-Out Reminder",
            html: checkOutEmail(reservation),
          });

          console.log("Email sent to:", reservation.email);
        } catch (err) {
          console.error("Email failed for:", reservation.email, err);
        }
      }),
    );
  } catch (error) {
    console.error("Error in check-out email job:", error);
  }
};
