const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { generateError } = require("../helpers");
const { createUser, getUserById, getUserByEmail, updateUserById } = require("../repositories/usersRepository");

//Crea un esquema de validacion con el paquete Joi
const schema = Joi.object().keys({
  username: Joi.string().min(4).max(120).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(4).max(20).required(),
});

const schema2 = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(4).max(20).required(),
});


//Registra a un usuario a partir del username, email y password
const newUserController = async (req, res, next) => {
  try {
    const { body } = req;
    await schema.validateAsync(body);
    const { username, email, password } = body;

    const id = await createUser(username, email, password);

    res.send({
      status: 'success',
      message: `User created with id: ${id}`,
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

    if (user.length === 0) {
      throw generateError('No hay ningun usuario con ese email y/o password', 404);
    }
    const { username } = user;

    res.status(200);
    res.send({ username, email });
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
      data: token,
    })

  } catch (error) {
    next(error);
  }
};

//Permiete actualizar la informacion de un usuario validado
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.auth;

    const { body } = req;
    await schema.validateAsync(body);
    const { username, email, password } = body;

    const userById = await getUserById(id);
    const user = await getUserByEmail(email);

    if (user && user.id != id) {
      throw generateError('Ya existe un usuario con ese email', 409);
    }

    let updatedPassword = userById.password;
    if (password) {
      const passwordHash = await bcrypt.hash(password, 8);

      updatedPassword = passwordHash;
    }

    await updateUserById({ id, username, email, password: updatedPassword });

    res.send({
      status: 'success',
      data: id, username, email
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  newUserController,
  loginController,
  updateUser,
  getUserProfile,
};
