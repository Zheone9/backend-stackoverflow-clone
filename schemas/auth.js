const { z } = require("zod");

const userValidationSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Given string is not an email",
    })
    .email("Not a valid email"),
  username: z
    .string()
    .min(6, {
      message: "Username must be 6 or more characters long",
    })
    .max(10, {
      message: "Username must be 10 or fewer characters long",
    }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(5, {
      message: "Password must be 5 or more characters long",
    })
    .max(15, {
      message: "Password must be 15 or fewer characters long",
    }),
});

module.exports = {
  userValidationSchema,
};
