// Importar repositorio y librerías necesarias
const userRepository  = require("../repositories/userRepository")
const { generateToken } = require('../helpers/jwt');
const { verifyGoogleIdToken } = require('../helpers/google/validateTokenId');
const loginUser = async ({ username, password }) => {
    const user = await userRepository.findByUsername(username);

    if (!user) {
        return { status: 400, response: { ok: false, message: 'Usuario no encontrado' } };
    }

    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
        return { status: 400, response: { ok: false, message: 'Contraseña incorrecta' } };
    }

    const token = await generateToken(user.id, user.username);

    return {
        status: 200,
        response: {
            ok: true,
            payload: {
                username: user.username,
                uid: user._id,
                reputation: user.reputation,
            },
            token,
        },
    };
};

const renewToken = async (uid, username) => {
    return await generateToken(uid, username);
};

const loginWithGoogle = async ({ id_token, clientId }) => {
    const googleUser = await verifyGoogleIdToken(id_token, clientId);
    if (!googleUser) {
        return { status: 400, response: { ok: false, message: 'Token de Google inválido' } };
    }

    let user = await userRepository.findByEmail(googleUser.email);

    if (!user) {
        const userData = {
            email: googleUser.email,
            usernameIsSet:false,
            isGoogleUser:true,
        };
        user = await userRepository.create(userData);
    }

    const token = await generateToken(user.id, null);

    return {
        status: 200,
        response: {
            ok: true,
            payload: {
                uid: user._id,
                reputation: user.reputation,
            },
            token,
        },
    };
};

const logout = (res) => {
    res.clearCookie('token');
    res.status(200).json({ ok: true, message: 'Sesión cerrada' });
};

module.exports = {
    loginUser,
    renewToken,
    loginWithGoogle,
    logout,
};