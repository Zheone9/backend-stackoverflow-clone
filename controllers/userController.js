const userService = require('../services/userService');

const changeUsername = async (req, res) => {
    try {
        const { username } = req;
        const { newUsername } = req.body;

        const result = await userService.changeUsername(req.uid, username, newUsername);

        if (!result.success) {
            return res.status(400).json({ message: result.message });
        }

        const token = result.token;
        const cookieOptions = result.cookieOptions;

        return res.cookie("jwtToken", token, cookieOptions).status(200).json({ message: "El nombre de usuario se ha actualizado con éxito" });

    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Error al actualizar el nombre de usuario" });
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

        return res.cookie("jwtToken", token, cookieOptions).status(200).json({ message: "El nombre de usuario se ha actualizado con éxito" });

    } catch (e) {
        res.status(500).json({ message: "Error al actualizar el nombre de usuario" });
    }
};

module.exports = {
    setUsername,
    changeUsername,
};