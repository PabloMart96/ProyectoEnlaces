require('dotenv').config();

const { getConnection } = require('./db');

//Creación la base de datos
async function main() {
  let connection;

  try {
    connection = await getConnection();

    console.log('Borrando tablas existentes');
    await connection.query(
      'ALTER TABLE ratings DROP FOREIGN KEY ratings_ibfk_2'
    );
    await connection.query(
      'ALTER TABLE ratings DROP FOREIGN KEY ratings_ibfk_1'
    );

    await connection.query('DROP TABLE IF EXISTS links');
    await connection.query('DROP TABLE IF EXISTS users');
    await connection.query('DROP TABLE IF EXISTS ratings');

    console.log('Creando las tablas de la base de datos');

    await connection.query(`
    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(30) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        image VARCHAR(200) NULL DEFAULT NULL,
        description TEXT NULL DEFAULT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    `);
    await connection.query(`
    CREATE TABLE links (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        user_id INTEGER NOT NULL,
        url VARCHAR(200) NOT NULL,
        titulo VARCHAR(200) NOT NULL,
        description VARCHAR(200) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );
    `);
    await connection.query(`
    CREATE TABLE ratings (
      id INTEGER PRIMARY KEY AUTO_INCREMENT,
      user_id INTEGER NOT NULL,
      link_id INTEGER NOT NULL,
      rating INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (link_id) REFERENCES links(id) ON DELETE CASCADE
  );
    `);

    // await connection.query(
    //   `INSERT INTO users (username, email, password, image, description) 
    //    VALUES ('pab43', 'pab_43@mail.test', 'root', NULL, 'Primera Cuenta'),
    //           ('josh_ruki', 'Josito@mail.test', 'root', NULL, 'Segunda Cuenta'),
    //           ('lokiPakillo', 'pakillo@mail.test', 'root', NULL, 'Tercera Cuenta'),
    //           ('Maritxu', 'maria@mail.test', 'root', NULL, 'Cuarta Cuenta'),
    //           ('Jon', 'jon@mail.com', 'root', NULL, 'Quinta Cuenta');`
    // );

    // await connection.query(
    //   `INSERT INTO links (user_id, url, titulo, description) 
    //   VALUES  (1, 'https://www.google.com/', 'Google', 'Mejor buscador del mundo'),
    //           (3, 'https://www.twitch.com/', 'Twitch', 'Streamers retransmitiendo en directo'),
    //           (1, 'https://www.youtube.com/', 'Youtube', 'Los mejores videos de todo internet'),
    //           (4, 'https://www.twitter.com/', 'Twitter', 'Centro de noticicas y desvarios');`
    // );
  } catch (error) {
    console.error(error);
  } finally {
    if (connection) connection.release();
    process.exit();
  }
}

main();
