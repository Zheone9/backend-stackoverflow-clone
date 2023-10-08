const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const { dbConnection } = require("./db/config");
const cookie = require("cookie");
const { verifyAndDecodeToken } = require("./helpers/jwt");
const jwt = require("jsonwebtoken");
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
dotenv.config({ path: envFile });

const expressApp = express();
const server = http.createServer(expressApp);
const io = require("./io").init(server);
// Base de datos
dbConnection();

// Cors
expressApp.use(
  cors({
    origin: ["http://localhost:5173", "http://192.168.100.12:5173"],
    credentials: true,
  })
);

// Directorio público
expressApp.use(express.static("public"));

// Lectura y parseo del body
expressApp.use(express.json());
expressApp.use(cookieParser());

expressApp.use("/api/auth", require("./routes/auth"));
expressApp.use("/api/questions", require("./routes/questions"));
expressApp.use("/api/account", require("./routes/account"));
expressApp.use("/api/users", require("./routes/users"));

io.use(async (socket, next) => {
  let decoded;
  const cookies =
    socket.request.headers.cookie &&
    cookie.parse(socket.request.headers.cookie);

  const token = cookies && cookies.jwtToken;
  const refreshToken = cookies && cookies.refreshToken;

  if (refreshToken === undefined) {
    return next(new Error("Refresh token is undefined"));
  }
  try {
    decoded = await verifyAndDecodeToken(token, refreshToken);
    socket.userId = decoded ? decoded.uid : undefined;
  } catch (err) {
    return next(new Error("Token verification failed"));
  }
  next();
});

io.on("connection", (socket) => {
  if (!socket.userId) {
    console.log("No userId found for this socket");
    return;
  }

  socket.join(socket.userId);
  console.log("se unio el usuario a la sala", socket.userId);

  socket.on("disconnect", () => {
    // Dejar la sala cuando un usuario se desconecta
    console.log("se ha desconectado", socket.userId);
  });
});

server.listen(process.env.PORT, () => {
  console.log("Servidor Express corriendo en puerto " + process.env.PORT);
});
