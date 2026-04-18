export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res
        .status(400)
        .json({ error: "Validation failed", details: errorMessages });
    }

    req.body = value; // Replace request body with validated/sanitized payload
    next();
  };
};

export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res
        .status(400)
        .json({ error: "Validation failed", details: errorMessages });
    }

    req.query = value;
    next();
  };
};
