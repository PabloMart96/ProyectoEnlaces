const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const path = require('path');
const fs = require('fs').promises;
const sharp = require('sharp');
const { generateError } = require("../helpers");
const { createUser, getUserById, getUserByEmail, updateUserById, uploadUserImage } = require("../repositories/usersRepository");

//Crea un esquema de validacion con el paquete Joi
const schema = Joi.object().keys({
  username: Joi.string().min(4).max(120).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(4).max(20).required(),
  description: Joi.string().min(4),
});

const schema2 = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(4).max(20).required(),
});

const validExtension = ['.jpeg', '.jpg', '.png', '.webp'];

//Registra a un usuario a partir del username, email y password
const newUserController = async (req, res, next) => {
  try {
    const { body } = req;
    await schema.validateAsync(body);
    const { username, email, password } = body;

    const id = await createUser(username, email, password);

    res.send({
      status: 'success',
      message: `Usuario creado con id: ${id}`,
      data: { username, email }
    });

  } catch (error) {
    next(error);
  }
};

//Devuelve el username y email de un usuario
const getUserProfile = async (req, res, next) => {
  try {
    const { email } = req.auth;
    const user = await getUserByEmail(email);

    if (!user) {
      throw generateError('No hay ningun usuario con ese email y/o password', 404);
    }
    const { id, username, created_at, image, description } = user;

    res.send({
      status: 'success',
      message: `Usuario con id: ${id}`,
      data: { username, email, created_at, image, description }
    });
  } catch (error) {
    next(error);
  }
}

//Login de un usuario a partir del email y el password, devolviendo el token de validacion
const loginController = async (req, res, next) => {
  try {
    const { body } = req;
    await schema2.validateAsync(body);
    const { email, password } = body;

    const user = await getUserByEmail(email);

    if (!user) {
      throw generateError('No existe un usuario con ese email y/o password', 401);
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw generateError('No existe un usuario con ese email y/o password', 401);
    }

    const { id, username } = user;
    const { JWT_SECRET } = process.env;
    const payload = { id, username, email };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: '30d',
    });

    res.send({
      status: 'success',
      access: token,
    })

  } catch (error) {
    next(error);
  }
};

//Permiete actualizar la informacion de un usuario validado
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.auth; //Obtencion del id de usuario a partir de la validacion

    const { body } = req;
    await schema.validateAsync(body);
    let { username, email, password, description } = body; //desestructuracion del body pasado en la req

    const userById = await getUserById(id); //Seleccionamos el usuario a partir del id de la validacion
    const user = await getUserByEmail(email); //Selecionamos el usuario a partir del email de la req

    //Comparamos que no exista un usuario con el email pasado por req
    if (user && user.id != id) {
      throw generateError('Ya existe un usuario con ese email', 409);
    }

    let updatedPassword = userById.password; //Seleccionamos la contraseña del usuario validado
    //si en la req se pasa una contraseña, se actualiza y se encripta
    if (password) {
      const passwordHash = await bcrypt.hash(password, 8);

      updatedPassword = passwordHash;
    }

    //Si no se pasa la descripcion como parametro, no eliminar la anterior
    const oldDescription = userById.description;
    if (!description) {
      description = oldDescription;
    }

    const { image } = user; //Seleccionamos la imagen del usuario.

    //En caso de que se pase la imagen por paramtro, la validamos y actualizamos
    if (req.files) {

      const { picture } = req.files;
      const extension = path.extname(picture.name);

      //validamos la extension de la imagen
      if (!validExtension.includes(extension)) {
        throw generateError('Formato no válido', 400);
      }

      // const user = await getUserById(id);


      //creamos la ruta de la imagen
      const pathPicture = path.join(__dirname, '../public/profile');

      if (image) {
        await fs.unlink(`${pathPicture}/${image}`);
      }

      const imageName = `${id}-${picture.name}`;
      const pathImage = `${pathPicture}/${imageName}`;

      //Redimensionamos la imagen
      await sharp(picture.data).resize(500, 500).toFile(pathImage);

      await uploadUserImage(id, imageName);

    }

    await updateUserById({ id, username, email, password: updatedPassword, description }); //Actualizamos el usuario

    res.send({
      status: 'success',
      message: "Usuario actualizado correctamente",
      data: { id, username, email, image, description },
    });
  } catch (error) {
    next(error);
  }
};


//Actualizacion de la imagen de perfil de usuario
const imagenController = async (req, res, next) => {
  try {

    const { email } = req.auth;
    const { files } = req;

    if (!files) {
      throw generateError('No se ha seleccionado fichero');
    }

    const { picture } = files;
    const extension = path.extname(picture.name);

    //validamos la extension de la imagen
    if (!validExtension.includes(extension)) {
      throw generateError('Formato no válido', 400);
    }

    const user = await getUserByEmail(email);
    const { id, username, image } = user;

    //creamos la ruta de la imagen
    const pathPicture = path.join(__dirname, '../public/profile');

    if (image) {
      await fs.unlink(`${pathPicture}/${image}`);
    }

    const imageName = `${id}-${picture.name}`;
    const pathImage = `${pathPicture}/${imageName}`;

    //Redimensionamos la imagen
    await sharp(picture.data).resize(500, 500).toFile(pathImage);

    await uploadUserImage(id, imageName);

    res.send({
      status: 'success',
      message: 'Imagen guardada y redimensionada exitosamente',
      data: { username, image },
    });

  } catch (error) {
    next()
  }
}

module.exports = {
  newUserController,
  loginController,
  updateUser,
  getUserProfile,
  imagenController,
};
