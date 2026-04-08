import Joi from "joi";

export const createPropertySchema = Joi.object({
  name: Joi.string().trim().required(),
});

export const updatePropertySchema = Joi.object({
  name: Joi.string().trim().required(),
});
