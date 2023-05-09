const { getConnection } = require('../db/db');

//Creamos una valoracion de la publicacion
const addVote = async (user_id, link_id, rating) => {
    let connection;

    try {
        connection = await getConnection();

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

module.exports = {
    addVote,
    getRating,
}