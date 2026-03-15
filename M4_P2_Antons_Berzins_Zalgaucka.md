# Memoria Práctica 2 — BlockBird (Mensajería pública)

## 1. Introducción

Esta memoria describe la Práctica 2 del proyecto BlockBird: implementación de una dApp mínima para publicar y consultar mensajes públicos en Ethereum.

Referencia del repositorio:

- URL SSH: `git@github.com:PejarRu/blockBird.git`
- URL Web: `https://github.com/PejarRu/blockBird`

## 2. Objetivos de la práctica

- Construir un contrato de mensajería pública.
- Permitir escritura de mensajes en blockchain.
- Permitir lectura de mensajes desde blockchain.
- Integrar el contrato con un flujo Web2 básico de consumo de artefactos.

## 3. Arquitectura del sistema

La Práctica 2 se centra en el diseño funcional de una mensajería pública en blockchain: publicar y consultar mensajes de forma simple, verificable y comprensible.

La primera implementación se desarrolló con una arquitectura sencilla basada en un único contrato de mensajes y utilidades Node de compilación/consumo.

Elementos principales de esa etapa:

- `blockBird.sol` (raíz): implementación inicial del contrato de mensajes.
- `compile.js`: utilidad de compilación en Node para generar artefactos en `build/`.
- `index.js`: entrada de compatibilidad para cargar artefactos.

Estado actual del repositorio:

- Posteriormente, la misma base funcional fue migrada a una estructura Hardhat (`contracts/`, `test/`, `scripts/`) para mejorar mantenibilidad, pruebas y despliegue.
- El archivo `blockBird.sol` en raíz se mantiene como **legacy** para trazabilidad académica.

## 4. Diseño del smart contract de mensajes (base funcional de la práctica)

Modelo de datos de mensaje:

- `text`: contenido del mensaje.
- `sender`: dirección que publica.
- `read`: marca de lectura (parte opcional respecto al enunciado mínimo).

Funciones clave implementadas en la práctica:

- `writeMessage(string)` para publicar mensajes.
- `readAllMessages()` para recuperar el histórico.
- `readUnreadMessages()` como extensión de lectura de no leídos.

Validación principal introducida:

- longitud máxima de 300 caracteres.

Evento principal:

- emisión de evento al publicar (`NewMessage` en la versión legacy).

## 5. Integración con la aplicación

En el contexto de la práctica 2, la integración se apoyó en artefactos ABI/bytecode para ser consumidos desde scripts o frontend Web2.

- `compile.js` generaba artefactos.
- `index.js` exponía una carga de artefacto para consumo externo.

Actualmente, para ejecución reproducible, la integración recomendada se realiza mediante Hardhat.

## 6. Pruebas realizadas

Durante la práctica base se validó el comportamiento de publicación y lectura de mensajes.

En el estado actual del repositorio, estas capacidades se validan además con tests automatizados (ya dentro del flujo Hardhat), que comprueban:

- publicación correcta,
- recuperación de mensajes,
- validaciones de entrada.

## 7. Conclusiones

La Práctica 2 resolvió el objetivo académico principal: definir e implementar una mensajería pública funcional sobre Ethereum. El diseño fue deliberadamente mínimo (KISS), con validaciones básicas y eventos para trazabilidad.

La evolución posterior a Hardhat no cambia el objetivo de la práctica, sino que consolida su implementación en una estructura más mantenible y reproducible.

Mejoras identificadas desde esta base (y tratadas en iteraciones posteriores):

- incluir `timestamp` en mensajes,
- robustecer el manejo de mensajes no leídos,
- formalizar flujo de compilación, test y despliegue con Hardhat como arquitectura principal.
