const { response } = require("express");
const jwt = require("jsonwebtoken");
const {generateToken} = require("../helpers/jwt");

const validarJWTSetUsername = (req, res = response, next) => {
    const token = req.cookies.jwtToken;

    if (!token) {
        console.log('No hay token')
        return res.status(401).json({ message: "Token is required" });
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            const newToken = generateToken(decodedToken.uid);
            const cookieOptions = {
                maxAge: 24 * 60 * 60 * 1000, // Tiempo de expiración en milisegundos
                secure: process.env.NODE_ENV === 'production', // Asegura que la cookie solo se envíe a través de HTTPS (opcional)
                sameSite: 'strict', // Previene ataques CSRF (opcional)
                httpOnly: true, // Asegura que la cookie solo sea accesible por el servidor, no por JavaScript
            };
            res.cookie("jwtToken", newToken, cookieOptions);
        } else {
            console.log(error.message)
            console.log('El token es invalido')
            return res.status(401).json({ message: "Invalid token" });
        }
    }
    console.log('Token valido')
    req.uid = decodedToken.uid;
    next();
};
module.exports = { validarJWTSetUsername };