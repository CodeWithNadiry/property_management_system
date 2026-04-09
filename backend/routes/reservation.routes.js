import { Router } from "express";
import {
  create,
  update,
  getAll,
  get,
  cancel,
  getConfirmationData,
  confirm,
  checkIn,
  checkOut,
  noShow,
  frontDeskCheckIn,
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
  validateRequest(createReservationSchema), // single schema body => default;
  // createReservationSchema is a Joi schema.
  // It has .validate → true
  // schemaMap becomes { body: createReservationSchema }
  isAuth,
  create,
);

router.patch(
  "/:id",
  isAuth,
  validateRequest({ params: idSchema, body: updateReservationSchema }),
  update,
);

router.get("/", isAuth, getAll);

router.get("/:id", isAuth, get);

router.patch("/:id/cancel", isAuth, cancel);

router.get("/:id/confirm_form", isAuth, getConfirmationData);

router.post(
  "/:id/confirm",
  isAuth,
  validateRequest({ params: idSchema, body: guestConfirmationSchema }),
  confirm,
);

router.post("/check_in", isAuth, checkIn);

router.post("/front_desk_check_in", isAuth, frontDeskCheckIn);

router.post("/:id/check_out", isAuth, checkOut);

router.post("/:id/noshow", isAuth, noShow);
export default router;
