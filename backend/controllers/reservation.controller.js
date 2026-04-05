import Passcode from "../models/passcode.model.js";
import Reservation from "../models/reservation.model.js";
import jwt from "jsonwebtoken";
import {
  cancelReservationService,
  createReservationService,
  guestCheckOutService,
  guestConfirmService,
  updateReservationService,
} from "../services/reservation.services.js";
import { sendEmail } from "../utils/sendEmail.js";
import { passcodeEmail } from "../utils/emailTemplate.js";
import ConfirmationForm from "../models/confirmationForm.model.js";

export async function createReservation(req, res, next) {
  try {
    const { property_id } = req.query;
    const result = await createReservationService(req.body, property_id);

    res.status(201).json({
      message: "Reservation created successfully",
      ...result,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}

export async function updateReservation(req, res, next) {
  try {
    const { id } = req.params;

    const filter = { id };

    if (req.userRole === "staff") {
      filter.property_id = req.userPropertyId;
    }

    if (req.userRole === "superadmin" && req.query.property_id) {
      filter.property_id = req.query.property_id;
    }

    const updatedReservation = await updateReservationService(filter, req.body);

    res.status(200).json({
      message: "Reservation updated successfully",
      reservation: updatedReservation,
    });
  } catch (error) {
    next(error);
  }
}
export async function getReservations(req, res, next) {
  try {
    const filter = {};

    console.log("property id: =======", req.query.property_id, req.userRole);
    if (req.userRole === "staff") {
      filter.property_id = req.userPropertyId;
    }

    if (req.userRole === "superadmin" && req.query.property_id) {
      filter.property_id = req.query.property_id;
    }

    console.log("Filter property id;", filter);
    const reservations = await Reservation.findAll({
      where: filter,
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({ reservations });
  } catch (error) {
    error.statusCode ||= 500;
    next(error);
  }
}

export async function getReservation(req, res, next) {
  try {
    const { id } = req.params;

    const filter = { id };

    if (req.userRole === "staff") {
      filter.property_id = req.userPropertyId;
    }

    if (req.userRole === "superadmin" && req.query.property_id) {
      filter.property_id = req.query.property_id;
    }

    const reservation = await Reservation.findOne({
      where: filter,
    });

    // SELECT * FROM reservations
    // WHERE id = 123 AND property_id = 5; // filter with 2 things, property_id, and reservation id
    if (!reservation) {
      return res.status(404).json({
        message: "Reservation not found",
      });
    }

    res.status(200).json({
      message: "Reservation fetched successfully",
      reservation,
    });
  } catch (error) {
    error.statusCode ||= 500;
    next(error);
  }
}
export async function cancelReservation(req, res, next) {
  try {
    const result = await cancelReservationService(req.params.id);

    res.status(200).json({
      message: "Reservation cancelled successfully",
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

export async function getConfirmationData(req, res, next) {
  try {
    const { id: reservation_id } = req.params;

    const reservation = await Reservation.findByPk(reservation_id, {
      attributes: ["name", "email", "phone"],
    });

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.status(200).json({
      reservation,
    });
  } catch (error) {
    next(error);
  }
}

export async function guestConfirm(req, res, next) {
  try {
    const { id: reservation_id } = req.params;

    const result = await guestConfirmService(req.body, reservation_id);

    res.status(200).json({
      confirmationForm: result.confirmationForm, // why not shwoing in browser devtools
      message: "Guest Confirmed successfully.",
    });
  } catch (error) {
    next(error);
  }
}

export async function guestCheckIn(req, res, next) {
  try {
    const { token } = req.body;

    if (!token) throw new Error("Token is required");

    const decoded = jwt.verify(token, "super" || process.env.JWT_SECRET);

    const { reservation_id } = decoded;

    const reservation = await Reservation.findByPk(reservation_id, {
      include: [ConfirmationForm],
    });

    if (!reservation)
      throw new Error("Reservation not available.");

    // if (new Date() < new Date(check_in)) {
    //   throw new Error("Too early to check in");
    // }

    const passcode = await Passcode.findOne({
      where: { reservation_id: reservation.id },
    });

    if (!passcode) throw new Error("Passcode not found");

    if (!reservation.ConfirmationForm) {
      throw new Error(
        "Guest must have submitted confirmation form before check in.",
      );
    }
    if (reservation.status === "checked_in") {
      return res.status(200).json({
        message: "Already checked in",
        passcode: passcode.code,
      });
    }

    await Reservation.update(
      { status: "checked_in" },
      { where: { id: reservation_id } },
    );

    try {
      await sendEmail({
        to: reservation.email,
        subject: "Checked in Successful",
        html: passcodeEmail({
          name: reservation.name,
          passcode: passcode.code,
        }),
      });

      console.log("email sent successfully");
    } catch (error) {
      console.log("failed to send email...");
    }

    res.status(200).json({
      message: "You checked in successfully",
      passcode: passcode.code,
    });
  } catch (error) {
    next(error);
  }
}

export async function frontDeskCheckIn(req, res, next) {
  try {
    const { reservation_id } = req.body;
    const reservation = await Reservation.findByPk(reservation_id, {
      include: [Passcode, ConfirmationForm]
    });

    if (!reservation) throw new Error("Reservation not found");

    if (reservation.status === "checked_in") {
      return res.status(200).json({
        message: "Already checked in",
        passcode: reservation.Passcode.code,
      });
    }

    // if (new Date() < new Date(reservation.check_in)) {
    //   throw new Error("Too early to check in");
    // }

    reservation.status = "checked_in";
    await reservation.save();

    res.status(200).json({
      message: "Guest checked in successfully",
      passcode: reservation.Passcode.code,
    });

  } catch (error) {
    next(error);
  }
}
export async function guestCheckOut(req, res, next) {
  try {
    const { id: reservation_id } = req.params;

    const reservation = await guestCheckOutService(reservation_id);

    res.status(200).json({
      message: "Guest checked out successfully.",
      reservation_id: reservation.id,
    });
  } catch (error) {
    next(error);
  }
}

export async function guestNoShow(req, res, next) {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findByPk(id);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    if (reservation.status !== "confirmed") {
      return res.status(400).json({
        message: "Only confirmed reservations can be marked as no-show",
      });
    }

    await Reservation.update(
      { status: "noshow" }, // what to update
      { where: { id: reservation.id } }, // where condition
    );

    await Passcode.update(
      { status: "expired" },
      { where: { reservation_id: reservation.id } },
    );

    res.status(200).json({
      message: "Guest marked as no-show.",
      reservation_id: reservation.id,
    });
  } catch (error) {
    next(error);
  }
}
