import Joi from "joi";

export const createLockSchema = Joi.object({
  property_id: Joi.number().required(),
  serial_number: Joi.string().trim().required(),
});