const z = require("zod");
const { string } = require("zod");

const isMongoId = (value) => {
  const isValidMongoId = /^[a-f\d]{24}$/i.test(value);
  return isValidMongoId;
};
const commentValidationSchema = z.object({
  body: z.string().min(5).max(500),
  entryId: string().refine(isMongoId, {
    message: "Invalid MongoDB ID",
  }),
});

module.exports = { commentValidationSchema };
