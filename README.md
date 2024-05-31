# Documentación del Contrato Inteligente BlockBird

## Visión General
BlockBird es un contrato inteligente de Solidity diseñado para la blockchain de Ethereum, que permite a los usuarios enviar y recibir mensajes con pseudónimos. Este contrato se ha desarrollado usando la versión `0.8.9` de Solidity y está orientado a plataformas donde la comunicación anónima con responsabilidad es esencial.

## Estructura del Contrato

### Estructura del Mensaje
- **Struct `Message`**: Representa un mensaje en la plataforma.
  - `text`: El contenido del mensaje.
  - `pseudonym`: El pseudónimo del remitente.
  - `read`: Booleano que indica si el mensaje ha sido leído.

### Variables de Estado
- **Array `messages`**: Almacena todos los mensajes en el contrato.
- **Mapping `pseudonyms`**: Vincula direcciones de Ethereum con pseudónimos de usuarios.
- **Mapping `pseudonymExists`**: Rastrea qué pseudónimos ya están en uso para garantizar su unicidad.

### Eventos
- **Evento `NewMessage`**: Emitido cuando se crea un nuevo mensaje, capturando el pseudónimo y el contenido del mensaje.

## Funciones del Contrato

### setPseudonym
- **Propósito**: Permite a los usuarios establecer o cambiar su pseudónimo.
- **Lógica**: Verifica si el pseudónimo ya está en uso. Actualiza los mappings `pseudonyms` y `pseudonymExists` en consecuencia.

### writeMessage
- **Propósito**: Permite a los usuarios escribir un nuevo mensaje.
- **Lógica**: Valida la longitud del mensaje y la existencia del pseudónimo del remitente. Añade el nuevo mensaje al array `messages`.

### readAllMessages
- **Propósito**: Proporciona una función de visualización para leer todos los mensajes.
- **Lógica**: Devuelve el array completo de `messages`.

### readUnreadMessages
- **Propósito**: Recupera todos los mensajes no leídos y los marca como leídos.
- **Lógica**: Cuenta los mensajes no leídos, los marca como leídos y los devuelve en un nuevo array.

### getPseudonymFromMessage
- **Propósito**: Obtiene un mensaje por su ID, incluyendo el pseudónimo del remitente.
- **Lógica**: Valida el ID del mensaje y devuelve el mensaje correspondiente del array `messages`.

## Decisiones de Diseño

### Implementación de Pseudónimos
- **¿Por Qué Pseudónimos?**: Para mantener el anonimato del usuario permitiendo la comunicación.
- **Unicidad**: Asegura que cada pseudónimo sea único, previniendo la suplantación.

### Lógica de Lectura de Mensajes
- **Eficiencia**: La función `readUnreadMessages` está diseñada para minimizar los costos de gas reduciendo las iteraciones de bucles.
- **Marcar como Leído**: Marca automáticamente los mensajes como leídos al recuperarlos, alineándose con el comportamiento típico de las plataformas de mensajes.

### Consideraciones de Almacenamiento de Datos
- **Costos de Almacenamiento en Ethereum**: Almacenar mensajes y pseudónimos en la cadena puede incurrir en costos significativos de gas. Esta decisión de diseño se tomó considerando la importancia de la descentralización e inmutabilidad para esta aplicación.

### Medidas de Seguridad
- **Guardia Contra Reentrancia**: No es necesario ya que no hay llamadas externas que puedan llevar a ataques de reentrancia.
- **Restricción de Longitud del Mensaje**: Previene el uso excesivo de gas y espacio de almacenamiento.

## Diagrama
```plaintext
Usuario -> setPseudonym -> mapping de pseudónimos
       -> writeMessage -> array de mensajes
       -> readAllMessages
       -> readUnreadMessages
       -> getPseudonymFromMessage

Eventos:
  NewMessage -> Activado en la creación de un nuevo mensaje
```

## Conclusión
El contrato inteligente BlockBird proporciona una plataforma para mensajes anónimos pero responsables en la blockchain de Ethereum. Su diseño se centra en el anonimato del usuario, la integridad de los datos y la minimización de los costos de gas. El contrato es adecuado para aplicaciones donde la privacidad del mensaje y la protección de la identidad del usuario son primordiales.