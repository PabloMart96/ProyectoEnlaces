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

ENDPOINTS

● POST/user - Registro de usuario.
● GET /user/:id - Devuelve información de usuario
● POST /login - Login de usuario (devuelve token)

● GET / - Lista de todos los links
● POST / - Permite crear un link
● GET /link/:id - Devuelve un link
● DELETE /link/:id - Borra un link si eres quien lo creo
●
●
