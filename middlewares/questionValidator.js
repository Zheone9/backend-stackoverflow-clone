const validateQuestion = (schema) => async (req, res, next) => {
  try {
    await schema.parseAsync(req.body);

    return next();
  } catch (error) {
    return res.status(400).json(error);
  }
};

module.exports = {
  validateQuestion,
};
