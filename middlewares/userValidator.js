const validateUser = (schema, omitEmail = false) => async (req, res, next) => {
  try {
    console.log(req.body)
    if (omitEmail) {
      const schemaWithoutUser = schema.omit({ email: true });
      await schemaWithoutUser.parseAsync(req.body);
    } else {
      await schema.parseAsync(req.body);
    }
    return next();
  } catch (error) {
    console.log(error.errors[0]);
    return res.status(400).json({
      error: error.errors[0],
    });
  }
};

module.exports = {
  validateUser,
};
