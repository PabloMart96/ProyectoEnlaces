const { getConnection } = require('../db/db');
const { generateError } = require('../helpers');

//Creamos una valoracion de la publicacion
const addVote = async (user_id, link_id, rating) => {
    let connection;

    try {
        connection = await getConnection();

        const [vote] = await connection.query(`
        SELECT * FROM ratings WHERE user_id = ? AND link_id = ?
        `,
            [user_id, link_id]);

        if (vote.length > 0) {
            throw generateError('El usuario ya ha realizado un voto sobre este enlace', 409);
        }

        const [result] = await connection.query(`
            INSERT INTO ratings (user_id, link_id, rating)
            VALUES(?,?,?)
        `,
            [user_id, link_id, rating]
        );

        return result.insertId;

    } finally {
        if (connection) connection.release();
    }
};

//Seleccionamos la media y la cantidad de votaciones sobre una publicacion
const getRating = async (link_id) => {
    let connection;

    try {
        connection = await getConnection();

        const [result] = await connection.query(`
            SELECT AVG(rating) as media,
            COUNT(rating) as numVotos
            FROM ratings WHERE link_id = ?
        `,
            [link_id]);

        return result[0];

    } finally {
        if (connection) connection.release();
    }
};

//Comprobar si el usuario ha votado ya en el link
const checkVoted = async (userId, id) => {
    let connection;
    try {
        connection = await getConnection();

        const [result] = await connection.query(`
            SELECT * FROM ratings WHERE id = ? AND user_id = ?
        `,
            [id, userId]);

        if (result.length > 0) {
            return true
        }

        return false;

    } finally {
        if (connection) connection.release();
    }
}


module.exports = {
    addVote,
    getRating,
    checkVoted
}