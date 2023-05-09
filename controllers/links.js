const Joi = require('joi');
const { getAllLinks, createLink, getLinkById, deleteLinkById } = require("../repositories/linksRepository");
const { generateError } = require('../helpers');

//Crea un esquema de validacion con el paquete Joi
const schema = Joi.object().keys({
  url: Joi.string().min(10).max(200).required(),
  titulo: Joi.string().min(3).max(200).required(),
  description: Joi.string().min(10).max(200).required()
});

const schema2 = Joi.number().integer().positive().required();

//Devuelve todos los links publicados
const getLinksController = async (req, res, next) => {
  try {
    const links = await getAllLinks();

    res.send({
      status: 'success',
      data: links,
    })

  } catch (error) {
    next(error);
  }
};

//Crea la publiacion de un link de un usuario registrado
const newLinkController = async (req, res, next) => {
  try {
    const { body } = req;
    await schema.validateAsync(body);
    const { url, titulo, description } = body;

    const userId = req.auth.id;

    const id = await createLink(userId, url, titulo, description);

    res.send({
      status: 'success',
      message: `Links con id: ${id} creado correctamente!!`
    });

  } catch (error) {
    next(error);
  }
};

//Borra una publicacion de un usuario registrado
const deleteLinkController = async (req, res, next) => {
  try {
    const userId = req.auth.id;
    const { id } = req.params;
    await schema2.validateAsync(id);

    const link = await getLinkById(id);
    if (link === 0) {
      throw generateError('El link no existe', 400);
    }

    if (userId !== link.user_id) {
      throw generateError('Estas tratando de borrar un link que no es tuyo', 401);
    }

    await deleteLinkById(id);

    res.send({
      status: 'success',
      message: `El link con id: ${id} fue borrado exitosamente!!`
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLinksController,
  newLinkController,
  deleteLinkController,
};
