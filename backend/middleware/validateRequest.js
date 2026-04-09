import { AppError } from "../utils/AppError.js";

export const validateRequest = (schemas) => {
  return (req, res, next) => {
    try {
      if (!schemas) throw new AppError("No schema provided", 500);

      const schemaMap = schemas.validate ? { body: schemas } : schemas;

      const { body, params, query } = schemaMap;
      if (body) {
        const { error, value } = body.validate(req.body, { abortEarly: true });
        if (error) throw new AppError(error.details[0].message, 422);
        req.body = value;
      }

      if (params) {
        const { error, value } = params.validate(req.params, {
          abortEarly: true,
        });
        if (error) throw new AppError(error.details[0].message, 422);
        req.params = value;
      }

      if (query) {
        const { error, value } = query.validate(req.query, {
          abortEarly: true,
        });
        if (error) throw new AppError(error.details[0].message, 422);
        req.query = value;
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

// If you pass a single schema, treat it as body.
// If you pass an object with body/params/query, use it as-is.

// {
//   params: idSchema,
//   body: guestConfirmationSchema
// }
// The object does not have .validate, only its properties (params and body) do.
// That’s why schemas.validate is undefined → false.

// ====================>>>>>>>==>
// What .validate is
// .validate exists only on a Joi schema object.
// Example:
// import Joi from "joi";

// const idSchema = Joi.object({ id: Joi.number().required() });
// console.log(typeof idSchema.validate); // "function" ✅
// So idSchema.validate exists.
