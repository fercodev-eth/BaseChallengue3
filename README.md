# Base Challenge – Day 3

Monorepo con dos proyectos complementarios para el Day 3 del challenge:

- **RewardContract/**: Contrato inteligente de recompensas y scripts de despliegue/pruebas.
- **paymaster-demo/**: Demo de Paymaster (AA) para cubrir gas u otras políticas de pago.

## Estructura

- **`RewardContract/`**: Código del contrato, configuración de toolchain y artefactos de compilación.
- **`paymaster-demo/`**: App/demo y utilidades para interactuar con el Paymaster.
- **`.gitignore`**: Reglas de ignore centralizadas (no se suben `.gitignore` internos).

## Requisitos

- Node.js LTS y npm o pnpm/yarn.
- Un cliente/SDK para contratos (por ejemplo, Foundry/Hardhat) instalado según el subproyecto.
- Variables de entorno en archivos `.env` (no versionados). Usa los `*.example` si existen.

## Quick Start

### 1) RewardContract/

```bash
cd RewardContract
# Instalar dependencias (según el stack del subproyecto)
npm install

# Compilar
npm run build

# Test
npm test

# (Opcional) Desplegar a una red local/testnet
npm run deploy
```

### 2) paymaster-demo/

```bash
cd paymaster-demo
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Build de producción
npm run build
```

## Notas

- Mantén tus claves y endpoints en `*.env`; no se suben al repo.
- Revisa los scripts disponibles en cada subcarpeta (`package.json` o tooling equivalente).
- Consulta la documentación de cada stack (Foundry/Hardhat/Vite/etc.) si necesitas comandos detallados.


