import { Router } from "express";
import {
  cancelReservation,
  createReservation,
  frontDeskCheckIn,
  getConfirmationData,
  getReservation,
  getReservations,
  guestCheckIn,
  guestCheckOut,
  guestConfirm,
  guestNoShow,
  updateReservation,
} from "../controllers/reservation.controller.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  createReservationSchema,
  guestConfirmationSchema,
  idSchema,
  updateReservationSchema,
} from "../schemas/reservation.schema.js";
import { isAuth } from "../middleware/isAuth.js";

const router = Router();

router.post(
  "/",
  validateRequest(createReservationSchema),
  isAuth,
  createReservation,
);

router.patch(
  "/:id",
  isAuth,
  validateRequest(idSchema, "params"),
  validateRequest(updateReservationSchema),
  updateReservation,
);

router.get("/", isAuth, getReservations);

router.get("/:id", isAuth, getReservation);

router.patch("/:id/cancel", isAuth, cancelReservation);

router.get("/:id/confirm_form", isAuth, getConfirmationData);

router.post(
  "/:id/confirm",
  validateRequest(idSchema, "params"),
  validateRequest(guestConfirmationSchema),
  // validateRequest(params: idSchema, body:guestCheckInSchema, query: checkinqueryschema),
  isAuth,
  guestConfirm
);

router.post(
  "/check_in",
  isAuth,
  guestCheckIn,
);

router.post('/front_desk_check_in', isAuth, frontDeskCheckIn);

router.post("/:id/check_out", isAuth, guestCheckOut);

router.post("/:id/noshow", isAuth, guestNoShow);
export default router;
