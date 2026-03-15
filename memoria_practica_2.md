# Memoria Práctica 2 — BlockBird

## 1. Introducción

Esta memoria documenta la Práctica 2 del proyecto BlockBird: una aplicación descentralizada (dApp) básica que permite publicar y consultar mensajes públicos en la blockchain. El objetivo de la práctica era diseñar e implementar el contrato inteligente que gestiona mensajes y su integración con una aplicación Web2 mínima.

### Referencia al repositorio

- Repositorio del proyecto (código fuente completo): `git@github.com:PejarRu/blockBird.git`
- Enlace web para revisión: `https://github.com/PejarRu/blockBird`

## 2. Objetivos de la práctica

- Implementar un smart contract que permita publicar mensajes públicos en la blockchain.
- Proveer funciones para consultar los mensajes almacenados.
- Integrar el contrato con una aplicación Web2 (mecanismo de compilación / artefactos) para permitir interacción desde un frontend.
- Documentar y demostrar el funcionamiento mediante pruebas básicas.

## 3. Arquitectura del sistema (enfoque de la práctica)

La arquitectura propuesta en la práctica 2 es simple y KISS: un único contrato inteligente encargado del almacenamiento y recuperación de mensajes, y una capa Web2 que compila y consume el artefacto del contrato.

- Contrato: archivo original `blockBird.sol` en la raíz del repositorio (implementación inicial del contrato de mensajes).
- Herramienta de compilación: script `compile.js` que leía fuentes `.sol` en `contracts/` (en la versión inicial apuntaba a `contracts/`) y escribía artefactos en `build/`.
- Punto de acceso para consumo desde Node: `index.js` que intentaba cargar artefactos desde `build/`.

Esta arquitectura evita dependencias complejas y permite a una interfaz Web2 (por ejemplo, un pequeño frontend o un script Node) leer el ABI y la dirección desplegada para interactuar con el contrato.

## 4. Diseño del smart contract (contrato de mensajes)

El contrato implementado en la Práctica 2 se centraba en un modelo de datos sencillo para representar mensajes:

- `struct Message`:
  - `text`: `string` — contenido del mensaje.
  - `sender`: `address` — dirección que envía el mensaje.
  - `read`: `bool` — marca si el mensaje ha sido leído (opcional en la especificación).

- `Message[] public messages` — array dinámico que almacena los mensajes.

- Evento `NewMessage(address indexed sender, string message)` — notifica nuevas publicaciones.

- Funciones principales:
  - `writeMessage(string memory _message)` — valida la longitud del mensaje (máx. 300 caracteres) y añade la entrada al array; emite `NewMessage`.
  - `readAllMessages() public view returns (Message[] memory)` — recupera todos los mensajes.
  - `readUnreadMessages()` (opcional) — intención de devolver los mensajes no leídos y marcarlos como leídos.

Fragmento relevante (implementación original del repositorio):

```solidity
// extracto de `blockBird.sol` (raíz)
struct Message { string text; address sender; bool read; }
Message[] public messages;
event NewMessage(address indexed sender, string message);

function writeMessage(string memory _message) public {
    require(bytes(_message).length <= 300, "Message exceeds 300 characters");
    messages.push(Message({text: _message, sender: msg.sender, read: false}));
    emit NewMessage(msg.sender, _message);
}

function readAllMessages() public view returns (Message[] memory) {
    return messages;
}
```

### Decisiones de diseño y defensivas

- Limitación de longitud del mensaje (300 caracteres) para controlar costes de almacenamiento y gas.
- Uso de evento para facilitar la indexación y lectura por parte de clientes externos.
- Mantener la lógica de datos en un único array para simplicidad (KISS), aunque con las implicaciones de coste de iteración en lectura.

## 5. Integración con la aplicación Web2

Para la práctica 2 se puso foco en disponer de artefactos que permitan a una aplicación Web2 consumir el contrato:

- `compile.js`: script que compilaba contratos (lectura de fuentes y escritura de `build/` con ABI/bytecode).
- `index.js`: punto de importación que cargaba el artefacto `build/blockBird` para que un script Node o servidor Web pueda crear instancias de contrato mediante `web3`/`ethers`.

Este patrón permite a un frontend (ej. HTML+JS con `ethers.js`) cargar el ABI y conectar a la dirección desplegada para invocar `writeMessage` o `readAllMessages`.

## 6. Pruebas realizadas

En la fase inicial no existían tests automatizados en el repositorio original. Para validar comportamiento básico durante el desarrollo se realizaron las siguientes comprobaciones manuales y automáticas (cuando se añadió soporte de testing):

- Verificación manual de `writeMessage` mediante llamadas desde scripts Node que usaban el ABI (comprobación de emisión de eventos y estado del array).
- Pruebas unitarias básicas añadidas posteriormente cubrieron:
  - publicación de un mensaje y emisión del evento correspondiente,
  - recuperación de mensajes con `readAllMessages`.

Los tests primarios se centraron en asegurar que la publicación y lectura funcionan correctamente y que la restricción de longitud se aplica.

## 7. Conclusiones

La Práctica 2 implementó con éxito la funcionalidad core de BlockBird: publicar y consultar mensajes en la blockchain siguiendo principios KISS y defensivas básicas (validaciones y eventos). La solución inicial era sencilla y adecuada para la finalidad académica; sin embargo, se identificaron mejoras posteriores (p. ej. añadir `timestamp`, evitar bucles con índices peligrosos) que se abordaron en iteraciones siguientes sin alterar la intención original de la práctica.
