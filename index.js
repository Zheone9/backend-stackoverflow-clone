const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const { dbConnection } = require("./db/config");
const io = require("./io");

const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
dotenv.config({ path: envFile });

const expressApp = express();
const server = http.createServer(expressApp);

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

io.init(server).on("connection", (socket) => {
  const userId = socket.handshake.auth.userId;
  if (!userId) return;
  // Unir al usuario a su propia sala basada en su ID
  socket.join(userId);
  console.log("se ha conectado", userId);
  socket.on("disconnect", () => {
    // Dejar la sala cuando un usuario se desconecta
    socket.leave(userId);
  });
});

server.listen(process.env.PORT, () => {
  console.log("Servidor Express corriendo en puerto " + process.env.PORT);
});
