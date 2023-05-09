const express = require('express');
const { newUserController, loginController, updateUser, getUserProfile } = require('../controllers/users');
const validateAuth = require('../middlewares/validateAuth');

const userRoutes = express.Router();


//ENDPOINTS PUBLICOS
userRoutes.route('/').post(newUserController);  //Registro de usuario
userRoutes.route('/login').post(loginController); //Login de usuario

//ENDPOINTS PRIVADOS
userRoutes.route('/profile').all(validateAuth).get(getUserProfile); //Devuelve la informacion del usuario
userRoutes.route('/profile').all(validateAuth).get(getUserProfile).put(updateUser); //Actualiza el username, email y password del usuario

module.exports = userRoutes;