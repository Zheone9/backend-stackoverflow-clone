const accessTokenCookieOptions = {
  maxAge: 20 * 1000, // 20sec
  secure: process.env.NODE_ENV === "production",
};

const refreshTokenCookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  secure: process.env.NODE_ENV === "production",
};

module.exports = {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
};
