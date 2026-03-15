# Memoria Práctica 3 — Contador de mensajes en BlockBird

## 1. Introducción

Esta memoria documenta la Práctica 3, que extiende la dApp BlockBird añadiendo un contrato separado cuyo propósito es mantener un contador de mensajes anclado en la blockchain. La práctica aborda la necesidad de separar responsabilidades y garantizar un conteo fiable y auditable del nº total de mensajes publicados.

### Referencia al repositorio

- Repositorio del proyecto (código fuente completo): `git@github.com:PejarRu/blockBird.git`
- Enlace web para revisión: `https://github.com/PejarRu/blockBird`

## 2. Objetivos de la práctica

- Implementar un nuevo smart contract `MessageCounter` que mantenga un contador `uint256`.
- Garantizar que el contador se incremente cada vez que se publique un mensaje desde el contrato de mensajes.
- Integrar ambos contratos de forma segura, con validaciones defensivas.
- Añadir pruebas que verifiquen la interacción entre contratos y el correcto incremento del contador.

## 3. Necesidad y motivación

Separar la responsabilidad de llevar el recuento en un contrato dedicado permite:

- Reducir la complejidad del contrato de mensajes.
- Facilitar auditoría y actualización del mecanismo de conteo sin tocar la lógica de publicación.
- Mejorar la modularidad y reutilización del componente de contadores.

Esta decisión sigue KISS y DRY: la lógica de publicación no se reimplementa para contar; en su lugar, se delega la operación al `MessageCounter`.

## 4. Diseño del nuevo smart contract (`MessageCounter`)

El contrato implementado es deliberadamente pequeño y explícito:

- Estado:
  - `uint256 private count` — contador interno.

- Eventos:
  - `CounterIncremented(address indexed by, uint256 newCount)` — notifica incrementos.

- Funciones públicas:
  - `increment()` — incrementa `count` en 1 y emite `CounterIncremented`.
  - `getCount() view returns (uint256)` — devuelve el valor actual.

Fragmento representativo (`contracts/MessageCounter.sol`):

```solidity
contract MessageCounter {
    uint256 private count;
    event CounterIncremented(address indexed by, uint256 newCount);

    function increment() public {
        count += 1;
        emit CounterIncremented(msg.sender, count);
    }

    function getCount() public view returns (uint256) {
        return count;
    }
}
```

### Decisiones de diseño y defensivas

- El contrato es minimalista: no asume permisos por defecto (cualquiera puede llamar `increment()` en esta versión). Esto facilita pruebas y despliegues iniciales; sin embargo, para entornos de producción se contempla restringir llamadas sólo desde el contrato de mensajes (ver sección de mejoras).

## 5. Interacción entre contratos (integración)

La integración se realizó modificando el contrato de mensajes para que almacene la dirección del contador y lo invoque al publicar un mensaje.

- Cambios principales en `BlockBird` (archivo `contracts/BlockBird.sol`):
  - Añadida la interfaz interna `IMessageCounter` con `increment()` y `getCount()`.
  - Campo `address public counter` y `address public owner`.
  - Constructor que recibe la dirección del contador (permitiendo inyección en despliegue).
  - `setCounter(address _counter)` para actualizar la referencia (sólo `owner`).
  - En `writeMessage(...)`, tras insertar el mensaje y emitir el evento, se llama a `IMessageCounter(counter).increment()`.

Fragmento esencial de integración en `BlockBird`:

```solidity
interface IMessageCounter { function increment() external; function getCount() external view returns (uint256); }

address public counter;

constructor(address _counter) {
    owner = msg.sender;
    if (_counter != address(0)) counter = _counter;
}

function writeMessage(string memory _message) public {
    // validaciones ...
    messages.push(...);
    emit MessagePosted(msg.sender, block.timestamp, _message);
    // integración: incremento del contador externo
    IMessageCounter(counter).increment();
}
```

### Validaciones defensivas realizadas

- `constructor` permite recibir la dirección del contador en el despliegue para forzar la dependencia desde el inicio.
- `setCounter` valida que la dirección no sea `address(0)` y que sólo el `owner` pueda cambiarla.
- `writeMessage` exige `counter != address(0)` antes de operar para evitar inconsistencias donde el mensaje se publique pero no haya contador disponible.

## 6. Despliegue y scripts

Se actualizó el script de despliegue `scripts/deploy.js` para:

1. Desplegar `MessageCounter`.
2. Desplegar `BlockBird` pasando la dirección del contador al constructor.

Resumen (comandos):

```bash
npx hardhat node
npm run deploy
```

El orden garantiza que `BlockBird` tenga la referencia correcta desde su creación y evita llamados a un contador no inicializado.

## 7. Pruebas realizadas

Se añadieron pruebas automáticas (`test/blockBird.test.js`) que comprueban la integración entre contratos:

- Despliegue de `MessageCounter` y `BlockBird` con la dirección del contador.
- Publicación de mensajes mediante `BlockBird.writeMessage(...)` y verificación de que:
  - el evento `MessagePosted` se emite correctamente,
  - `BlockBird.getMessageCount()` refleja el número de entradas locales en `messages`,
  - `MessageCounter.getCount()` incrementa de forma paralela y coherente.

Ejemplo de aserción realizada en tests:

```javascript
await blockBird.writeMessage('Hello');
expect((await counter.getCount()).toNumber()).to.equal(1);
expect((await blockBird.getTotalMessages()).toNumber()).to.equal(1);
```

Además, los tests verifican que llamadas repetidas incrementan el contador (cobertura básica de la interacción).

## 8. Ventajas de separar responsabilidades

- Modularidad: `MessageCounter` puede ser reemplazado o mejorado sin tocar la lógica de mensajes.
- Auditabilidad: el contador es una entidad autónoma cuyo historial (eventos `CounterIncremented`) facilita el cómputo off-chain.
- Mantenibilidad: las responsabilidades están bien delimitadas; cambios en el mecanismo de conteo (p. ej. sumar pesos o controles adicionales) no afectan al contrato principal.

## 9. Mejoras futuras y consideraciones de seguridad

- Restringir `MessageCounter.increment()` para que sólo pueda ser invocado por el contrato `BlockBird` (ej. almacenar la dirección autorizada en `MessageCounter` o añadir `onlyOwner`/modificador).
- Añadir mecanismos de prueba de integridad en `BlockBird` para detectar desincronizaciones entre `messages.length` y `MessageCounter.getCount()`.
- Considerar coste de gas y diseño off-chain para grandes volúmenes: mantener en cadena sólo lo necesario y delegar indexación a soluciones off-chain cuando proceda.

## 10. Conclusión

La Práctica 3 aporta una separación de responsabilidades necesaria para sistemas en producción: un componente ligero y auditable (`MessageCounter`) gestiona el conteo y el contrato de mensajes mantiene su foco en la lógica de publicación. La integración asegura consistencia básica y las pruebas añaden confianza en la interacción entre contratos.
