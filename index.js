const express = require("express");
const { dbConnection } = require("./db/config");
const cors = require("cors");
const cookieParser = require('cookie-parser');

const dotenv = require("dotenv");

const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
dotenv.config({ path: envFile });

const expressApp = express();
//Base de datos
dbConnection();



//cors
expressApp.use(
  cors({
    origin: ["http://localhost:5173","http://192.168.100.12:5173"],
    credentials: true,
  })
);
//Directorio publico
expressApp.use(express.static("public"));
//Lectura y parseo del body
expressApp.use(express.json());
expressApp.use(cookieParser());

expressApp.use("/api/auth", require("./routes/user"));
expressApp.use("/api/questions", require("./routes/questions"));
expressApp.use("/api/account", require("./routes/account"));
//Middleware para agregar headers de Control de Acceso HTTP

expressApp.listen(process.env.PORT, () => {
  console.log("servidor corriendo en puerto " + process.env.PORT);
});

module.exports=expressApp