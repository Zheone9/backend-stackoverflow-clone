const { rateLimit } = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limitar a 100 solicitudes por ventana
  message:
    "Has excedido el límite de intentos de inicio de sesión. Inténtalo de nuevo más tarde.",
});
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // Límite de 10 intentos por ventana
  message:
    "Has excedido el límite de registros permitidos. Inténtalo de nuevo más tarde.",
}); 

const forumLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 30, // Límite de 30 publicaciones por ventana
  message:
    "Has excedido el límite de publicaciones permitidas. Inténtalo de nuevo más tarde.",
});

const logoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limitar a 100
});

module.exports = {
  loginLimiter,
  registerLimiter,
  forumLimiter,
  logoutLimiter,
};
