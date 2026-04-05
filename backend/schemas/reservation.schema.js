import Joi from "joi";

export const createReservationSchema = Joi.object({
  name: Joi.string().trim().required(),

  email: Joi.string().email().required(),

  phone: Joi.string().trim().required(),

  room_id: Joi.number().integer().positive().required(),

  check_in: Joi.date().required(),

  check_out: Joi.date().greater(Joi.ref("check_in")).required(),
});

export const updateReservationSchema = Joi.object({
  name: Joi.string().trim().optional(),

  email: Joi.string().email().optional(),

  phone: Joi.string().trim().optional(),

  room_id: Joi.number().integer().positive().required(),

  check_in: Joi.date().optional(),

  check_out: Joi.date().greater(Joi.ref("check_in")).optional(),
});

export const guestConfirmationSchema = Joi.object({
  name: Joi.string().trim().required(),

  email: Joi.string().email().required(),

  phone: Joi.string().trim().required(),
  city: Joi.string().trim().required(),
  country: Joi.string().trim().required(),
  number_of_guests: Joi.number().integer().positive().required(),
});

export const idSchema = Joi.object({
  id: Joi.number().required(),
});
