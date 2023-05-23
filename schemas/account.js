const z = require("zod");

const usernameSchema = z.string().min(6).max(10);

module.exports = {
    usernameSchema,
};
