require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const {
  newUserController,
  getUserController,
  loginController,
} = require('./controllers/users');
const {
  getLinksController,
  newLinkController,
  getSingleLinkController,
  deleteLinkController,
} = require('./controllers/links');

const app = express();

app.use(morgan('dev'));

//Rutas de user
app.post('/user', newUserController);
app.get('/user/:id', getUserController);
app.post('/login', loginController);

//Rutas de links
app.get('/', getLinksController);
app.post('/', newLinkController);
app.get('/link/:id', getSingleLinkController);
app.delete('/link/:id', deleteLinkController);

//Middleware de 404
app.use((req, res) => {
  res.status(404).send({
    status: 'error',
    message: 'Not found',
  });
});

//Middleware que gestiona los errores de la aplicacion
app.use((error, req, res, next) => {
  console.error(error);

  res.status(error.httpStatus || 500).send({
    status: 'error',
    message: error.message,
  });
});

//Lanzamos el server

app.listen(3000, () => {
  console.log('Servidor funcionando!');
});
