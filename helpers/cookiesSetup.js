const accessTokenCookieOptions = {
  maxAge: 20 * 1000, // 1 hour
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  httpOnly: true,
};

const refreshTokenCookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  httpOnly: true,
};

module.exports = {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
};
