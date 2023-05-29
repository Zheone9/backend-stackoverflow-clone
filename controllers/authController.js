const authService = require('../services/authService');

const loginUser = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);
    res.status(result.status).json(result.response);
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
    res.status(result.status).json(result.response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, message: 'Por favor hable con el administrador' });
  }
};

const logout = (req, res) => {
  authService.logout(res);
};

module.exports = {
  loginUser,
  renewToken,
  loginWithGoogle,
  logout,
};