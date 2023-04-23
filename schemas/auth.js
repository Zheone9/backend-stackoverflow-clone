const { z } = require("zod");

const userValidationSchema = z.object({
  email: z
    .string({
      required_error: "email is required",
      invalid_type_error: "given string is not an email",
    })
    .email("Not a valid email"),
  username: z
    .string()
    .min(5, {
      message: "Must be 5 or more characters long",
    })
    .max(10, {
      message: "Must be 5 or fewer characters long",
    }),
  password: z
    .string({
      required_error: "password is required",
    })
    .min(5, {
      message: "Must be 5 or more characters long",
    })
    .max(15, {
      message: "Must be 5 or fewer characters long",
    }),
});

module.exports = {
  userValidationSchema,
};
