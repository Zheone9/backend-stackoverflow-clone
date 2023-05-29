const userRepository = require('../repositories/userRepository');
const { generateToken } = require('../helpers/jwt');

const changeUsername = async (uid, oldUsername, newUsername) => {
    const user = await userRepository.findByUsername(newUsername);

    if (user) {
        return { success: false, message: "El nombre de usuario ya existe." };
    }

    const updatedUser = await userRepository.updateUsername(uid, oldUsername, newUsername);
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

    const updatedUser = await userRepository.updateUsernameById(uid, username);
    const token = await generateToken(uid, username);

    const cookieOptions = {
        maxAge: 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        httpOnly: true,
    };

    return { success: true, token, cookieOptions };
};

module.exports = {
    changeUsername,
    setUsername,
};