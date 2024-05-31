# Documentación del Contrato Inteligente BlockBird

## Introduccion

Proyecto hecho para la tarea de TokioSchool. Tema de Ethhereum.

```
El ejercicio consiste en la generación de un Smart Contract para una aplicación de mensajería pública.
Por lo tanto deberás implementar una aplicación descentralizada haciendo uso de los conocimientos adquiridos en el módulo, para el envío y lectura de mensajes públicos (una red social parecida a Twitter).

La aplicación deberá tener al menos estas dos funciones:
- Una función para escribir un mensaje de una longitud máxima de 300 caracteres.
- Una función para leer todos los mensajes escritos hasta el momento.

Opcionalmente:
- Añadir un mecanismo para conseguir recuperar solo aquellos mensajes que no se hayan leído hasta el monto.
- Añadir un mecanismo para identificar a la persona (con su seudónimo) que ha escrito el mensaj
```

El contrato se ha desarrollado usando la versión `0.8.9` de Solidity y está orientado a plataformas donde la comunicación anónima con responsabilidad es esencial.

## Estructura del Contrato

### Estructura del Mensaje

- **Struct `Message`**: Representa un mensaje en la plataforma.
  - `text`: El contenido del mensaje.
  - `sender`: La direccion del remitente. Sería la direccion publica
  - `read`: Booleano que indica si el mensaje ha sido leído.

   Este objeto (o struct) es necesario para almcanar de una manera comoda y facil lo que es un "mensaje". Entre los datos elgidos a almacenar estos tres: `text`, `pseudonym`, `read`, son los mas relevantes para el enunciado de la tarrea

### Variables

- **Array `messages`**: Almacena todos los mensajes del contrato en una unica variable. De este modo se puede filtrar que mensaje fue leido, escrito, etc...
<!-- - **Mapping `pseudonyms`**: Vincula direcciones de Ethereum con pseudónimos de usuarios. -->
<!-- - **Mapping `pseudonymExists`**: Rastrea qué pseudónimos ya están en uso para garantizar su unicidad. -->


### Eventos

- **Evento `NewMessage`**: Emitido cuando se crea un nuevo mensaje, capturando el adrress del emitente y el contenido del mensaje.

## Funciones del Contrato

<!-- ### setPseudonym

- **Propósito**: Permite a los usuarios establecer o cambiar su pseudónimo.
- **Lógica**: Verifica si el pseudónimo ya está en uso. Actualiza los mappings `pseudonyms` y `pseudonymExists` en consecuencia. -->

### writeMessage

- **Propósito**: Permite a los usuarios escribir un nuevo mensaje.
- **Lógica**: Valida la longitud del mensaje y la existencia del pseudónimo del remitente. Añade el nuevo mensaje al array `messages`.

### readAllMessages

- **Propósito**: Proporciona una función de visualización para leer todos los mensajes.
- **Lógica**: Devuelve el array completo de `messages`.

### readUnreadMessages

- **Propósito**: Recupera todos los mensajes no leídos y los marca como leídos.
- **Lógica**: Cuenta los mensajes no leídos, los marca como leídos y los devuelve en un nuevo array.

<!-- ### getPseudonymFromMessage

- **Propósito**: Obtiene un mensaje por su ID, incluyendo el pseudónimo del remitente.
- **Lógica**: Valida el ID del mensaje y devuelve el mensaje correspondiente del array `messages`. -->

## Decisiones de Diseño

<!-- ### Implementación de Pseudónimos

- **¿Por Qué Pseudónimos?**: Para mantener el anonimato del usuario permitiendo la comunicación.
- **Unicidad**: Asegura que cada pseudónimo sea único, previniendo la suplantación. -->

### Lógica de Lectura de Mensajes

- **Eficiencia**: La función `readUnreadMessages` está diseñada para minimizar las iteraciones de bucles. Se aprovecha que los datos se cuardan de modo secuencial (Uno mensaje tras otro).
Gracias a que se almacenan secuencialmente, los mesnajes escritos, siempre aparecerán en un todos al inico del array de mensajes
- **Marcar como Leído**: Marca automáticamente los mensajes como leídos tras deteccion de lo contrario para así, copiar comportamiento típico de las plataformas de mensajes.

### Medidas de Seguridad

- **Restricción de Longitud del Mensaje**: Previene el uso excesivo de gas y espacio de almacenamiento mediante la revision de caracteres en el mesaje a la hora de escribirlo.

## Diagrama

```plaintext
Usuario -> writeMessage -> array de mensajes
       -> readAllMessages
       -> readUnreadMessages

Eventos:
  NewMessage -> Activado en la creación de un nuevo mensaje
```
<!-- ```plaintext
Usuario -> setPseudonym -> mapping de pseudónimos
       -> writeMessage -> array de mensajes
       -> readAllMessages
       -> readUnreadMessages
       -> getPseudonymFromMessage

Eventos:
  NewMessage -> Activado en la creación de un nuevo mensaje
``` -->