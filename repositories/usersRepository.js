const bcrypt = require('bcrypt');
const { getConnection } = require('../db/db');
const { generateError } = require('../helpers');

//Crear un usuario en la base de datos y devolver su id
const createUser = async (username, email, password) => {
    let connection;
    try {
        connection = await getConnection();

        const [user] = await connection.query(`
            SELECT id FROM users WHERE email = ?
        `,
            [email]);

        if (user.length > 0) {
            throw generateError('Ya existe un usuario en la base de datos con ese email', 409);
        }

        const passwordHash = await bcrypt.hash(password, 8);

        const [newUser] = await connection.query(`
            INSERT INTO users (username,email, password) VALUES (?, ?, ?)
        `,
            [username, email, passwordHash]);

        return newUser.insertId;

    } finally {
        if (connection) connection.release();
    }
};

//Devuelve la informacion de un usuario por su id
const getUserById = async (id) => {
    let connection;

    try {
        connection = await getConnection();
        const [result] = await connection.query(`
            SELECT id, username,email, created_at FROM users WHERE id = ? 
        `,
            [id]);

        if (result.length === 0) {
            throw generateError('No hay ningun usuario con esa id', 404);
        }

        return result[0];

    } finally {
        if (connection) connection.release();
    }
};

//Devuelve la informacion del usuario por su email
const getUserByEmail = async (email) => {
    let connection;

    try {
        connection = await getConnection();
        const [result] = await connection.query(`
            SELECT * FROM users WHERE email = ?
        `,
            [email]);

        return result[0];
    } finally {
        if (connection) connection.release();
    }
};

//Actualizacion de la informacion del usuario por el Id
const updateUserById = async (data) => {
    let connection;
    const { id, username, email, password } = data;

    try {
        connection = await getConnection();

        await connection.query(`
            UPDATE users
            SET username = ?, email = ?, password = ? WHERE id = ?
        `,
            [username, email, password, id]);

        return true;
    } finally {
        if (connection) connection.release();
    }

}


module.exports = {
    createUser,
    getUserById,
    getUserByEmail,
    updateUserById,
}