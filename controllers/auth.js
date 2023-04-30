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
    req.session.user = {
      _id: user._id,
      username: user.username,
      reputation: user.reputation,
    };

    const token = await generateToken(user.id, user.username);
    const cookieOptions = {
      maxAge: 24 * 60 * 60 * 1000, // Tiempo de expiración en milisegundos
      secure: process.env.NODE_ENV === 'production', // Asegura que la cookie solo se envíe a través de HTTPS (opcional)
      sameSite: 'strict', // Previene ataques CSRF (opcional)
      httpOnly: true, // Asegura que la cookie solo sea accesible por el servidor, no por JavaScript
    };

    // Enviar JWT token como una cookie HTTPOnly
    res.cookie('jwtToken', token, cookieOptions);
    res.status(201).json({
      payload: {
        username: user.username,
        uid: user._id,
        reputation: user.reputation,
      },
      ok: true,
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



    const token = await generateToken(user.id, user.username);
    // Enviar el token JWT al cliente
    const cookieOptions = {
      maxAge: 24 * 60 * 60 * 1000, // Tiempo de expiración en milisegundos
      secure: process.env.NODE_ENV === 'production', // Asegura que la cookie solo se envíe a través de HTTPS (opcional)
      sameSite: 'strict', // Previene ataques CSRF (opcional)
      httpOnly: true, // Asegura que la cookie solo sea accesible por el servidor, no por JavaScript
    };

    // Enviar JWT token como una cookie HTTPOnly
    res.cookie('jwtToken', token, cookieOptions);
    res.json({
      payload: {
        username: user.username,
        uid: user._id,
        reputation: user.reputation,
      },
      ok: true,
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
    req.session.user = {
      _id: user._id,
      username: user.username,
      reputation: user.reputation,
    };
    const token = await generateToken(user.id, user.username);
    const username = user.username;

    const cookieOptions = {
      maxAge: 24 * 60 * 60 * 1000, // Tiempo de expiración en milisegundos
      secure: process.env.NODE_ENV === 'production', // Asegura que la cookie solo se envíe a través de HTTPS (opcional)
      sameSite: 'strict', // Previene ataques CSRF (opcional)
      httpOnly: true, // Asegura que la cookie solo sea accesible por el servidor, no por JavaScript
    };

    // Enviar JWT token como una cookie HTTPOnly
    res.cookie('jwtToken', token, cookieOptions);
    res.json({
      payload: {
        username,
        uid: user._id,
        reputation: user.reputation,
      },
      ok: true,
      msg: "login successful",
    });
  } catch (error) {
    console.log(error)
      res.status(500).json({
        ok: false,
        message: "Por favor hable con el administrador",
      });
  }
};
const logout=(req,res=Response)=>{
  res.clearCookie('jwtToken');
      res.status(200).json({ message: 'Logout successful' });


}


const renewToken = async (req, res = response) => {
  const { username, uid } = req;
  const token = await generateToken(uid, username);
  const cookieOptions = {
    maxAge: 24 * 60 * 60 * 1000, // Tiempo de expiración en milisegundos
    secure: process.env.NODE_ENV === 'production', // Asegura que la cookie solo se envíe a través de HTTPS (opcional)
    sameSite: 'strict', // Previene ataques CSRF (opcional)
    httpOnly: true, // Asegura que la cookie solo sea accesible por el servidor, no por JavaScript
  };
  res.cookie('jwtToken', token, cookieOptions);
  res.json({
    ok:true
  })


};

module.exports = {
  createUser,
  loginUser,
  renewToken,
  loginWithGoogle,
  logout,

};
