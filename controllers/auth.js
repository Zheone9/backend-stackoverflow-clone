const { response } = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../helpers/jwt");
const { verifyGoogleIdToken } = require("../helpers/google/validateTokenId");

const createUser = async (req, res = response) => {
  const { email, password, username } = req.body;
  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        ok: false,
        message: "Un usuario existe con ese email",
      });
    }
    user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({
        ok: false,
        message: "Un usuario ya eligió ese usuario",
      });
    }
    user = new User(req.body);
    //encrypt password
    const salt = bcrypt.genSaltSync();

    user.password = bcrypt.hashSync(password, salt);

    await user.save();
    const token = await generateToken(user.id, user.username);

    res.status(201).json({
      ok: true,
      uid: user.id,
      token,
      msg: "user created",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      message: "Por favor hable con el administrador",
    });
  }
};

const loginWithGoogle = async (req, res = response) => {
  const { id_token, clientId } = req.body;
  try {
    const payload = await verifyGoogleIdToken(id_token, clientId);
    const googleUser = payload;

    // Verificar si el usuario ya existe en la base de datos
    let user = await User.findOne({ email: googleUser.email });
    if (!user) {
      // Crear un nuevo usuario en la base de datos si no existe
      user = new User({
        username: googleUser.name,
        email: googleUser.email,
        isGoogleUser: true,
      });
      await user.save();
    } else {
      // Actualizar la información del usuario si ya existe
      user.username = googleUser.name;
      // otros campos de usuario
      await user.save();
    }

    // Generar un token JWT para el usuario
    const token = await generateToken(user.id, user.username);
    // Enviar el token JWT al cliente
    res.json({
      payload: {
        username: user.username,
      },
      ok: true,
      token,
      msg: "login successful",
    });
  } catch (error) {
    // El id_token no es válido
    res.status(401).json({ message: "No se pudo autenticar con Google" });
    console.log(error);
  }
};

const loginUser = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Usuario o contraseña incorrectos",
      });
    }
    const token = await generateToken(user.id, user.username);
    const username = user.username;
    res.json({
      payload: {
        username,
      },
      ok: true,
      token,
      msg: "login successful",
    });
  } catch (error) {
    console.log(error),
      res.status(500).json({
        ok: false,
        message: "Por favor hable con el administrador",
      });
  }
};

const renewToken = async (req, res = response) => {
  const { username, uid } = req;
  const token = await generateToken(uid, username);

  res.json({
    ok: true,
    token,
  });
};

module.exports = {
  createUser,
  loginUser,
  renewToken,
  loginWithGoogle,
};
