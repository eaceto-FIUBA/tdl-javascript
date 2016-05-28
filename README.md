# TDL Char

## API

### Crea un usuario en la sala de chat

    PUT         /api/user/:username/join

Si el usuario pudo ser creado devuelve

    STATUS CODE 201     {"username": <username>}

Si el usuario no pudo ser creado devuelve

    STATUS CODE 409     {"error": "El usuario '<username>' ya existe en la sala."}


### Borra a un usuario de la sala de chat

    DELETE      /api/user/:username/leave

Si el usuario pudo ser borrado devuelve

    STATUS CODE 200

Si el usuario no pudo ser borrado devuelve

    STATUS CODE 404

