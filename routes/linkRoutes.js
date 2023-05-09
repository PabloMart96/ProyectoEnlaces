const express = require('express');
const validateAuth = require('../middlewares/validateAuth');
const { getLinksController, newLinkController, deleteLinkController } = require('../controllers/links');
const { registerVoteController, getAverageRatings } = require('../controllers/ratings');

const linkRoutes = express.Router();


//ENDPOINTS PUBLICOS
linkRoutes.route('/').get(getLinksController); //Mostrar todos los enlaces publicados
linkRoutes.route('/:id/average').get(getAverageRatings); //Mostrar la media de las valoraciones de una publicacion


//ENDPOINTS PRIVADOS
linkRoutes.route('/create').all(validateAuth).post(newLinkController); //Permite crear una publicacion de un enlace.
linkRoutes.route('/:id').all(validateAuth).delete(deleteLinkController); //Permite borrar una publicacion si eres quien la creo
linkRoutes.route('/:id/ratings').all(validateAuth).post(registerVoteController); //Permite votar un enlace de otro usuario

module.exports = linkRoutes;