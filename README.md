# BlockBird

Proyecto académico de Tokio School para el módulo de Ethereum.

## Resumen

BlockBird es una dApp mínima de mensajería pública en Ethereum.

- Práctica 2: contrato de mensajes (publicar y consultar mensajes).
- Práctica 3: extensión con contrato `MessageCounter` para contar mensajes publicados.

Repositorio:
- URL SSH: `git@github.com:PejarRu/blockBird.git`
- URL Web: `https://github.com/PejarRu/blockBird`

## Propósito académico

El objetivo es demostrar una arquitectura simple, mantenible y verificable para:

1. escribir mensajes en blockchain,
2. leer mensajes almacenados,
3. integrar contratos entre sí (`BlockBird` + `MessageCounter`),
4. ejecutar flujo de desarrollo con Hardhat (compilar, testear y desplegar).

## Arquitectura actual (fuente de verdad)

La arquitectura principal del proyecto es Hardhat:

- Contratos: `contracts/`
- Tests: `test/`
- Script de despliegue: `scripts/deploy.js`
- Configuración: `hardhat.config.js`

### Contratos

#### `contracts/BlockBird.sol`

Contrato principal de mensajería.

Funciones incluidas:

- `writeMessage(string)`
- `readAllMessages()`
- `readUnreadMessages()`
- `getMessage(uint256)`
- `getMessageCount()`
- `getTotalMessages()`
- `setCounter(address)`

Validaciones actuales:

- mensaje no vacío,
- máximo 300 caracteres,
- contador configurado antes de publicar.

Cada mensaje almacena:

- `text`,
- `sender`,
- `timestamp`,
- `read`.

Evento principal:

- `MessagePosted(address sender, uint256 timestamp, string message)`.

#### `contracts/MessageCounter.sol`

Contrato mínimo para contar mensajes en cadena.

- `increment()` aumenta el contador.
- `getCount()` devuelve el total.

Integración: `BlockBird.writeMessage(...)` llama a `MessageCounter.increment()` tras publicar un mensaje.

## Estructura de carpetas

```text
blockBird/
├─ contracts/
│  ├─ BlockBird.sol
│  └─ MessageCounter.sol
├─ scripts/
│  └─ deploy.js
├─ test/
│  └─ blockBird.test.js
├─ hardhat.config.js
├─ package.json
├─ README.md
├─ README.md.eng
├─ memoria_practica_2.md
├─ memoria_practica_3.md
├─ blockBird.sol          (legacy)
├─ compile.js             (legacy)
└─ index.js               (legacy compatibility)
```

## Instalación

```bash
npm install
```

## Compilación

```bash
npm run compile
```

## Tests

```bash
npm test
```

Cobertura principal de tests:

- estado inicial sin mensajes,
- publicación de mensajes,
- emisión de evento,
- incremento de contador,
- lectura total,
- lectura de no leídos y marcado como leídos,
- timestamp presente,
- reverts por mensaje vacío,
- reverts por mensaje > 300,
- revert por índice fuera de rango,
- control de `setCounter` (solo owner),
- rechazo de dirección cero en `setCounter`.

## Despliegue local

Terminal 1:

```bash
npx hardhat node
```

Terminal 2:

```bash
npm run deploy
```

Orden de despliegue actual:

1. `MessageCounter`
2. `BlockBird` con dirección del contador

## Qué cubre cada práctica

### Práctica 2

- Diseño base de mensajería pública en blockchain.
- Escritura y lectura de mensajes.
- Primer flujo de integración con utilidades Web2/Node.

### Práctica 3

- Contrato `MessageCounter` separado.
- Integración entre contratos.
- Contador total de mensajes anclado en blockchain.

## Nota sobre archivos legacy

Se conservan por trazabilidad académica y compatibilidad histórica:

- `blockBird.sol`: versión inicial, no usada por Hardhat.
- `compile.js`: compilador legacy, no forma parte del flujo principal.
- `index.js`: punto de entrada de compatibilidad para artefactos legacy.

Para entrega y evaluación, el flujo recomendado es exclusivamente Hardhat.
