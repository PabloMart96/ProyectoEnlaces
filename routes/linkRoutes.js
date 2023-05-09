const express = require('express');
const validateAuth = require('../middlewares/validateAuth');
const { getLinksController, newLinkController, deleteLinkController } = require('../controllers/links');

const linkRoutes = express.Router();


//ENDPOINTS PUBLICOS
linkRoutes.route('/').get(getLinksController); //Mostrar todos los enlaces publicados


//ENDPOINTS PRIVADOS
linkRoutes.route('/create').all(validateAuth).post(newLinkController); //Permite crear una publicacion de un enlace.
linkRoutes.route('/:id').all(validateAuth).delete(deleteLinkController); //Permite borrar una publicacion si eres quien la creo


module.exports = linkRoutes;