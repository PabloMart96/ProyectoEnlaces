TÍTULO
App para compartir enlaces.

DESCRIPCIÓN
Implementar una API que permita a los usuarios registrarse y compartir enlaces web que
consideren interesantes. Otros usuarios podrán votarlos si les gustan.



USUARIOS ANÓNIMOS
Los usuarios anónimos sólo podrán registrarse y acceder. No hay contenido accesible
públicamente.
● Login (email, password)
● Registro (nombre, email, password)

USUARIOS REGISTRADOS
● Ver los enlaces publicados en el día de hoy y en días anteriores
● Publicar nuevo enlace
○ URL
○ Título
○ Descripción
● Borrar un enlace publicado por el usuario
● Votar un enlace de otro usuario
● Editar perfil de usuario: (nombre, email, password)
● Opcional:
○ Edición avanzada del perfil de usuario (biografía, foto)


Instalación y Ejecución del proyecto
1- Clonar repositorio.
2- Moverse dentro de la carpeta del repositorio.
3- Actualizar el fichero .env con la configuracion local y ejecutar el comando node db/initDB.js en la terminal para crear la base de datos.
4- Ejecutar npm install
5- Ejecutar script nodemon "npm run dev"
6- Abrir el postman y ejecutar los siguentes Endpoints con sus respectivos metodos

ENDPOINTS

● POST/user - Registro de usuario.
● GET /user/:id - Devuelve información de usuario.
● POST /user/login - Login de usuario (devuelve token).
● GET /user/:id/links - Devuelve enlaces publicados por el usuario.
● GET /user/:id/links/:linkId - Devuelve enlace publicado por el usuario.
● POST /user/:id/links - Crea un enlace para un usuario.

● GET /links - Lista de todos los links.
● GET /links/:id - Devuelve un link.
● POST /links/create - Crea un enlace.
● DELETE /links/:id - Borra un link si eres quien lo creo.
● GET /links/:id/ratings - Devuelve la valoracion de un enlace.
● GET /links/:id/average - Devuelve la media de valoraciones de un enlace.
● POST /links/:id/ratings - Crea una valoracion para un enlace.
