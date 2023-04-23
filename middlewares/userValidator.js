const validateUser = (schema, omitUser = false) => async (req, res, next) => {
  try {
    if (omitUser) {
      const schemaWithoutUser = schema.omit({ username: true });
      await schemaWithoutUser.parseAsync(req.body);
    } else {
      await schema.parseAsync(req.body);
    }

    return next();
  } catch (error) {
    console.log(object);
    return res.status(400).json(error);
  }
};

module.exports = {
  validateUser,
};
