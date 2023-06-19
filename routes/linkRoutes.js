const express = require('express');
const validateAuth = require('../middlewares/validateAuth');
const { getLinksController, newLinkController, deleteLinkController } = require('../controllers/links');
const { registerVoteController, getAverageRatings, getUserVote } = require('../controllers/ratings');

const linkRoutes = express.Router();


//ENDPOINTS PRIVADOS
linkRoutes.route('/create').all(validateAuth).post(newLinkController); //Permite crear una publicacion de un enlace.
linkRoutes.route('/:id').all(validateAuth).delete(deleteLinkController); //Permite borrar una publicacion si eres quien la creo
linkRoutes.route('/:id/ratings').all(validateAuth).post(registerVoteController); //Permite votar un enlace de otro usuario
linkRoutes.route('/').all(validateAuth).get(getLinksController); //Mostrar todos los enlaces publicados
linkRoutes.route('/:id/average').all(validateAuth).get(getAverageRatings); //Mostrar la media de las valoraciones de una publicacion
linkRoutes.route('/:id').all(validateAuth).get(getUserVote); //Mostrar si un usuario ha votado en un enlace

module.exports = linkRoutes;