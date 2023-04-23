const { OAuth2Client } = require("google-auth-library");

const verifyGoogleIdToken = async (token, clientId) => {
  try {
    const client = new OAuth2Client(clientId);

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: clientId,
    });
    const payload = ticket.getPayload();
    console.log("payload en verify", payload);
    return payload;
  } catch (error) {
    console.error("Error al verificar el token de Google:", error.message);
    throw new Error("Error al verificar el token de Google");
  }
};

module.exports = {
  verifyGoogleIdToken,
};
