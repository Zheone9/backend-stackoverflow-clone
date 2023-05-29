const authService = require('../services/authService');

const loginUser = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);
    const token = result.token;
    const cookieOptions = result.cookieOptions;

    res.cookie("jwtToken",token,cookieOptions)
        .status(result.status)
        .json(result.response);

  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, message: 'Por favor hable con el administrador' });
  }
};

const renewToken = async (req, res) => {
  try {
    const { uid, username } = req;
    const token = await authService.renewToken(uid, username);
    res.status(200).json({ ok: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, message: 'Por favor hable con el administrador' });
  }
};

const loginWithGoogle = async (req, res) => {
  try {
    const result = await authService.loginWithGoogle(req.body);
    // Enviar el token JWT al cliente
    const token = result.token;
    const cookieOptions = result.cookieOptions;
    res.cookie("jwtToken",token,cookieOptions)
        .status(result.status).json(result.response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, message: 'Por favor hable con el administrador' });
  }
};

const logout = (req, res) => {
  res.clearCookie('jwtToken');
  res.status(200).json({ ok: true, message: 'Sesión cerrada' });
};

module.exports = {
  loginUser,
  renewToken,
  loginWithGoogle,
  logout,
};