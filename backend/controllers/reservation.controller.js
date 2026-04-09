import { reservationService } from "../services/reservation.services.js";

const {
  createReservation,
  updateReservation,
  getReservations,
  getReservation,
  cancelReservation,
  guestConfirm,
  guestCheckIn,
  guestFrontDeskCheckIn,
  guestCheckOut,
  guestNoShow,
  findReservationById,
} = reservationService;

export async function create(req, res, next) {
  try {
    const { property_id } = req.query;

    const result = await createReservation(req.body, property_id);

    res.status(201).json({
      message: "Reservation created successfully",
      ...result,
    });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const filter = { id: req.params.id };

    if (req.userRole === "staff") {
      filter.property_id = req.userPropertyId;
    }

    if (req.userRole === "superadmin" && req.query.property_id) {
      filter.property_id = req.query.property_id;
    }

    // no filter is = {
    //   id: 5,
    //   property_id: 10
    // }

    const reservation = await updateReservation(filter, req.body);

    res.status(200).json({
      message: "Reservation updated successfully",
      reservation,
    });
  } catch (err) {
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

    const reservations = await getReservations(filter);

    res.status(200).json({ reservations });
  } catch (err) {
    next(err);
  }
}

export async function get(req, res, next) {
  try {
    const filter = { id: req.params.id };

    if (req.userRole === "staff") {
      filter.property_id = req.userPropertyId;
    }

    if (req.userRole === "superadmin" && req.query.property_id) {
      filter.property_id = req.query.property_id;
    }

    const reservation = await getReservation(filter);

    res.status(200).json({
      message: "Reservation fetched successfully",
      reservation,
    });
  } catch (err) {
    next(err);
  }
}

export async function cancel(req, res, next) {
  try {
    const result = await cancelReservation(req.params.id);

    res.status(200).json({
      message: "Reservation cancelled successfully",
      ...result,
    });
  } catch (err) {
    next(err);
  }
}

export async function getConfirmationData(req, res, next) {
  try {
    const { id: reservation_id } = req.params;

    const reservation = await findReservationById(reservation_id);

    res.status(200).json({
      name: reservation.name,
      email: reservation.email,
      phone: reservation.phone,
    });
  } catch (error) {
    next(error);
  }
}

export async function confirm(req, res, next) {
  try {
    const confirmationForm = await guestConfirm(req.body, req.params.id);

    res.status(200).json({
      message: "Guest confirmed successfully",
      confirmationForm,
    });
  } catch (err) {
    next(err);
  }
}

export async function checkIn(req, res, next) {
  try {
    const result = await guestCheckIn(req.body.token);

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function frontDeskCheckIn(req, res, next) {
  try {
    const result = await guestFrontDeskCheckIn(req.body.reservation_id);

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function checkOut(req, res, next) {
  try {
    const reservation = await guestCheckOut(req.params.id);

    res.status(200).json({
      message: "Checked out successfully",
      reservation_id: reservation.id,
    });
  } catch (err) {
    next(err);
  }
}

export async function noShow(req, res, next) {
  try {
    const reservation = await guestNoShow(req.params.id);

    res.status(200).json({
      message: "Marked as no-show",
      reservation_id: reservation.id,
    });
  } catch (err) {
    next(err);
  }
}
