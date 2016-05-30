# TDL Chat

## API

### Login de un usuario

    PUT          /api/user/:username/login

La respuesta será {"loggedin": (true|false}



### Crea un usuario en la sala de chat

    PUT         /api/user/:username/join/:socket

Si el usuario pudo ser creado devuelve

    STATUS CODE 201     {"username": <username>, "socket": <socket.io id>}

Si el usuario no pudo ser creado devuelve

    STATUS CODE 409     {"error": "El usuario '<username>' ya existe en la sala."}


### Borra a un usuario de la sala de chat

    DELETE      /api/user/:username/exit

Si el usuario pudo ser borrado devuelve

    STATUS CODE 200

Si el usuario no pudo ser borrado devuelve

    STATUS CODE 404

