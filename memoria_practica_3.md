# Memoria Práctica 3 — BlockBird (Integración de MessageCounter)

## 1. Introducción

Esta memoria documenta la Práctica 3 del proyecto BlockBird: ampliación del contrato de mensajería con un segundo contrato dedicado al conteo de mensajes publicados.

Referencia del repositorio:

- URL SSH: `git@github.com:PejarRu/blockBird.git`
- URL Web: `https://github.com/PejarRu/blockBird`

## 2. Objetivos de la práctica

- Añadir el contrato `MessageCounter` para mantener un contador en blockchain.
- Integrar el contrato de mensajes (`BlockBird`) con `MessageCounter`.
- Incrementar el contador automáticamente al publicar cada mensaje.
- Verificar la integración con pruebas automatizadas.

## 3. Arquitectura de la ampliación

Se adopta separación de responsabilidades:

- `BlockBird`: gestiona publicación, lectura y metadatos del mensaje.
- `MessageCounter`: gestiona exclusivamente el total acumulado.

Esta separación reduce acoplamiento y facilita mantenimiento/auditoría de cada responsabilidad.

## 4. Diseño de smart contracts

### `contracts/MessageCounter.sol`

Contrato mínimo con una única responsabilidad:

- estado `count` (`uint256 private`),
- `increment()` para aumentar el contador,
- `getCount()` para consultar el total,
- evento `CounterIncremented` para trazabilidad.

### `contracts/BlockBird.sol`

Extensión del contrato de mensajes con integración externa:

- referencia a contrato contador vía `address public counter`,
- interfaz `IMessageCounter` para `increment()` y `getCount()`,
- constructor con dirección de contador,
- `setCounter(address)` para actualizar referencia (solo owner),
- `writeMessage(...)` publica mensaje y llama a `increment()`.

Funciones activas en la versión final:

- `writeMessage`
- `readAllMessages`
- `readUnreadMessages`
- `getMessage`
- `getMessageCount`
- `getTotalMessages`
- `setCounter`

Validaciones activas:

- mensaje no vacío,
- longitud máxima de 300,
- contador configurado antes de publicar,
- índice válido en `getMessage`,
- dirección no nula y control de propietario en `setCounter`.

## 5. Integración entre contratos

Flujo funcional al publicar:

1. el usuario llama a `BlockBird.writeMessage(...)`,
2. `BlockBird` valida entrada y guarda mensaje,
3. se emite `MessagePosted`,
4. `BlockBird` invoca `MessageCounter.increment()`.

Consulta de totales:

- `BlockBird.getTotalMessages()` delega en `MessageCounter.getCount()`.

## 6. Despliegue

Script: `scripts/deploy.js`.

Orden de despliegue implementado:

1. desplegar `MessageCounter`,
2. desplegar `BlockBird` pasando la dirección de `MessageCounter`.

Este orden garantiza que `BlockBird` nace con dependencia resuelta para contabilizar publicaciones desde el inicio.

## 7. Pruebas realizadas

Los tests en `test/blockBird.test.js` validan:

- estado inicial de mensajes en cero,
- publicación de mensaje,
- emisión de evento `MessagePosted`,
- incremento de `MessageCounter`,
- lectura de todos los mensajes,
- presencia de `timestamp`,
- lectura de no leídos y marcado a leídos,
- revert por mensaje vacío,
- revert por mensaje > 300 caracteres,
- revert por índice fuera de rango en `getMessage`,
- restricción de propietario en `setCounter`,
- rechazo de dirección cero en `setCounter`.

## 8. Limitaciones de seguridad actuales

La implementación actual mantiene simplicidad deliberada:

- `MessageCounter.increment()` es público.

Implicación:

- cualquier cuenta puede incrementar el contador directamente sin pasar por `BlockBird`.

Esta limitación se deja explícita por honestidad técnica y por mantener el alcance mínimo de la práctica.

## 9. Conclusiones

La Práctica 3 cumple el objetivo de extender BlockBird con un contador en cadena integrado de forma clara y verificable. La separación entre lógica de mensajería y lógica de conteo mejora la mantenibilidad del sistema sin introducir complejidad innecesaria.