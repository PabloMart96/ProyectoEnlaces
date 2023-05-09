const jwt = require('jsonwebtoken');
const { generateError } = require('../helpers');

//Extrae el token de el campo authorization de los headers
const extractAccessToken = (headers) => {
    const { authorization } = headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        throw generateError('Autorizacion Requerida', 403);
    }

    return authorization.split(" ")[1];
}

//Verifica la clave secreta con el token y lo decodifica
const validateAuth = (req, res, next) => {
    try {
        const { headers } = req;
        const { JWT_SECRET } = process.env;

        const token = extractAccessToken(headers);
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const { id, username, email } = decodedToken;
        req.auth = { id, username, email };
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = validateAuth;