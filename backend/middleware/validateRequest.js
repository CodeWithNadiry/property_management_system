export const validateRequest = (schema, property = "body") => {
  return (req, res, next) => {
    const valueToValidate = req[property]; // "body", "params", or "query"
    const { error, value } = schema.validate(valueToValidate, { abortEarly: true });

    if (error) {
      const err = new Error(error.details[0].message);
      err.statusCode = 422;
      return next(err);
    }

    req[property] = value;
    next();
  };
};