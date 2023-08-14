const userService = require("../services/userService");

const changeUsername = async (req, res) => {
  try {
    const { username } = req;
    const { newUsername } = req.body;

    const result = await userService.changeUsername(
      req.uid,
      username,
      newUsername
    );

    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }

    const token = result.token;
    const cookieOptions = result.cookieOptions;

    return res
      .cookie("jwtToken", token, cookieOptions)
      .status(200)
      .json({ message: "El nombre de usuario se ha actualizado con éxito" });
  } catch (e) {
    console.log(e.message);
    res
      .status(500)
      .json({ message: "Error al actualizar el nombre de usuario" });
  }
};
const createUser = async (req, res) => {
  try {
    const result = await userService.createUser(req.body);
    res.status(result.status).json(result.response);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ ok: false, message: "Por favor hable con el administrador" });
  }
};
const setUsername = async (req, res) => {
  try {
    const { username } = req.body;

    const result = await userService.setUsername(req.uid, username);

    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }

    const token = result.token;
    const cookieOptions = result.cookieOptions;

    return res
      .cookie("jwtToken", token, cookieOptions)
      .status(200)
      .json({ message: "El nombre de usuario se ha actualizado con éxito" });
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error al actualizar el nombre de usuario" });
  }
};
const getUserInfo = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await userService.getUserInfo(username);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({
      payload: {
        username: user.username,
        picture: user.picture,
        reputation: user.reputation,
        joinDate: user.joinDate,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener la información del usuario" });
  }
};

const uploadImage = async (req, res) => {
  if (req.file) {
    try {
      const { uid } = req;
      const updatedUser = await userService.updateUserPhotoUrl(
        uid,
        req.file.path
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.status(200).json({
        payload: {
          picture: updatedUser.picture,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: "Error al actualizar el URL de la foto",
        error: error,
      });
    }
  } else {
    res.status(400).json({
      message: "Error: Solo se permiten imágenes en formato PNG o JPG",
    });
  }
};

module.exports = {
  setUsername,
  changeUsername,
  createUser,
  uploadImage,
  getUserInfo,
};
