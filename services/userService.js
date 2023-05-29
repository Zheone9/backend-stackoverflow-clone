const userRepository = require('../repositories/userRepository');
const { generateToken } = require('../helpers/jwt');
const bcrypt = require("bcryptjs");

const changeUsername = async (uid, oldUsername, newUsername) => {
    const user = await userRepository.findByUsername(newUsername);

    if (user) {
        return { success: false, message: "El nombre de usuario ya existe." };
    }

     await userRepository.updateUsername(uid, oldUsername, newUsername);
    const token = await generateToken(uid, newUsername);

    const cookieOptions = {
        maxAge: 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        httpOnly: true,
    };

    return { success: true, token, cookieOptions };
};

const setUsername = async (uid, username) => {
    const user = await userRepository.findByUsername(username);

    if (user) {
        return { success: false, message: "El nombre de usuario ya existe." };
    }

    await userRepository.updateUsernameById(uid, username);
    const token = await generateToken(uid, username);

    const cookieOptions = {
        maxAge: 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        httpOnly: true,
    };

    return { success: true, token, cookieOptions };
};

const createUser = async ({ email, password, username }) => {
    // Comprobar si el usuario ya existe
    let user = await userRepository.findByEmail(email);

    if (user) {
        return { status: 400, response: { ok: false, message: 'Un usuario existe con ese email' } };
    }

    user = await userRepository.findByUsername(username);
    if (user) {
        return { status: 400, response: { ok: false, message: 'El nombre de usuario ya existe, elige otro.' } };
    }

    // Crear y guardar el usuario
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(password, salt);
    user = await userRepository.create({ email, password: hashedPassword, username });

    // Generar token y enviarlo como respuesta
    const token = await generateToken(user.id, user.username);
    return {
        status: 201,
        response: {
            payload: {
                username: user.username,
                uid: user._id,
                reputation: user.reputation,
            },
            ok: true,
            msg: 'user created',
            token,
        },
    };
};

module.exports = {
    changeUsername,
    setUsername,
    createUser
};