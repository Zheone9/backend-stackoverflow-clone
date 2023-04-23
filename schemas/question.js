const z = require("zod");

// Define el esquema de validación con Zod
const questionValidationSchema = z.object({
  title: z.string().min(5).max(50),
  body: z.string().min(10).max(500),
});

module.exports = {
  questionValidationSchema,
};
