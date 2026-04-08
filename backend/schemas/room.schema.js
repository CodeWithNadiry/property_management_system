import Joi from "joi";

export const createRoomSchema = Joi.object({
  room_number: Joi.string().trim().required(),
  floor: Joi.number().optional().allow(null),
  unit_group_id: Joi.number().required(),
});

export const updateRoomSchema = Joi.object({
  room_number: Joi.string().trim().optional(),
  floor: Joi.number().optional().allow(null),
  unit_group_id: Joi.number().required(),
});
