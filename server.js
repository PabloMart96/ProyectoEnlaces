require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const userRoutes = require('./routes/userRoutes');
const linkRoutes = require('./routes/linkRoutes');

const app = express();
const { PORT } = process.env;
const port = PORT | 3000;

app.use(fileUpload()); //Con este paquete subimos los ficheros
app.use(express.json()); //Para leer formatos JSON
app.use(morgan('dev')); //Generar registro de acceso en la terminal
app.use(cors()); //Habilita el acceso a la Api desde cualquier origen

//Rutas de user
app.use('/user', userRoutes);

//Rutas de links
app.use('/links', linkRoutes);

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
app.listen(port, () => {
  console.log('Servidor funcionando!');
});
