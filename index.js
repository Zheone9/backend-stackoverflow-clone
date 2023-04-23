const express = require("express");
const { dbConnection } = require("./db/config");
const cors = require("cors");

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
expressApp.use(cors());
//Directorio publico
expressApp.use(express.static("public"));
//Lectura y parseo del body
expressApp.use(express.json());
//Rutas
expressApp.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "*");
  res.set("Access-Control-Allow-Credentials: true");
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
expressApp.use("/api/auth", require("./routes/auth"));
expressApp.use("/api/questions", require("./routes/questions"));
//Middleware para agregar headers de Control de Acceso HTTP

expressApp.listen(process.env.PORT, () => {
  console.log("servidor corriendo en puerto " + process.env.PORT);
});
