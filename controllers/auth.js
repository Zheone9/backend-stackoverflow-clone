const { response } = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../helpers/jwt");

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
};
