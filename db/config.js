const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("DB Online");
  } catch (error) {
    throw new Error("Error a la hora de iniciar la base de datos. Ver logs.");
  }
};

module.exports = {
  dbConnection,
};
