import Joi from "joi";

export const createUserSchema = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
  role: Joi.string().valid("admin", "staff").required(),
  property_id: Joi.number().allow(null),
  is_active: Joi.boolean().optional(),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().trim().optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(5).optional(),
  role: Joi.string().valid("admin", "staff").optional(),
  property_id: Joi.number().allow(null).optional(),
  is_active: Joi.boolean().optional(),
});
