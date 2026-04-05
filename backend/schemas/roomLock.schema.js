import Joi from "joi";

export const assignLockSchema = Joi.object({
  room_id: Joi.number().required(),
  lock_id: Joi.number().required(),
  property_id: Joi.number().required(),
});