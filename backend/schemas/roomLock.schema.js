import Joi from "joi";

export const assignLockSchema = Joi.object({
  room_id: Joi.number().greater(0).required(),
  lock_id: Joi.number().greater(0).required(),
});

export const editAssignLockSchema = Joi.object({
  room_id: Joi.number().required(),
  lock_id: Joi.number().required(),
});
