const { getConnection } = require('../db/db');


//Devuelve todos los links de la base de datos
const getAllLinks = async () => {
    let connection;

    try {
        connection = await getConnection();

        const [result] = await connection.query(`
            SELECT l.url, l.titulo, l.description, l.created_at, u.username, u.email, u.image FROM links l INNER JOIN users u ON l.user_id = u.id ORDER BY created_at DESC
        `);
        return result;
    } finally {
        if (connection) connection.release();
    }
};

//Crea la publicacion de un link
const createLink = async (userId, url, titulo, description) => {
    let connection;

    try {
        connection = await getConnection();

        const [result] = await connection.query(`
            INSERT INTO links (user_id, url, titulo, description) VALUES (?, ?, ?, ?)
        `,
            [userId, url, titulo, description]);

        return result.insertId;
    } finally {
        if (connection) connection.release();
    }
};

//Devuelve el link a partir del id
const getLinkById = async (id) => {
    let connection;

    try {
        connection = await getConnection();

        const [result] = await connection.query(`
            SELECT * FROM links WHERE id = ?
        `,
            [id]);
        return result[0];
    } finally {
        if (connection) connection.release();
    }
};

//Borra el link a partir del id
const deleteLinkById = async (id) => {
    let connection;

    try {
        connection = await getConnection();

        await connection.query(`
            DELETE FROM links WHERE id = ?
        `,
            [id]);

        return;
    } finally {
        if (connection) connection.release();
    }
};

module.exports = {
    getAllLinks,
    createLink,
    getLinkById,
    deleteLinkById,
}