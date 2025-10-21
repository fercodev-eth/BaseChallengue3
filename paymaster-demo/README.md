# Base Batches – Paymaster Demo (Gasless Claim)

> React + Vite dApp para reclamar un reward en Base Sepolia usando Coinbase Paymaster (transacciones sin gas).

## Resumen
- **Objetivo**: demostrar `wallet_sendCalls` con soporte de Paymaster y el SDK oficial de Base para cuentas.
- **Flujo**:
  - Conectar wallet (Base Account SDK).
  - Verificar Paymaster URL válida y capacidades del wallet.
  - Invocar `claimReward()` en un contrato de Rewards en Base Sepolia (gasless).
  - Esperar confirmación del batch y mostrar estatus/resultados.

## Características
- **Conectar / Desconectar** wallet con `@base-org/account`.
- **Cambio automático de red** a `Base Sepolia` si es necesario.
- **Transacción gasless** vía `wallet_sendCalls` + Paymaster.
- **UI** con feedback de estados y errores.

## Requisitos
- Node 18+
- npm o yarn
- Contrato `Rewards` desplegado en Base Sepolia con función `claimReward()`
- URL de Paymaster válida (Coinbase Developer Platform)

## Instalación
```bash
npm install
# o
yarn
```

## Variables de entorno
Crea `paymaster-demo/.env` en la raíz del proyecto con:
```bash
VITE_REWARDS_CONTRACT_ADDRESS=0x...
VITE_PAYMASTER_SERVICE_URL=https://api.developer.coinbase.com/rpc/v1/base-sepolia/...
VITE_BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
# Opcional: si usas clientes públicos en utils
VITE_RPC_URL=https://base-sepolia.g.alchemy.com/v2/...
```
- Vite solo expone variables que empiezan con `VITE_`.
- Tras editar `.env`, reinicia el dev server.

## Ejecutar
```bash
npm run dev
# o
yarn dev
```
- Abre `http://localhost:5173/`.

## Uso
1. Clic en **Connect Wallet**.
2. La app cambiará/agregará Base Sepolia si no estás en esa red.
3. Clic en **Claim Reward (Gasless)** para ejecutar `claimReward()`.
4. Observa estados: `claiming → confirming → confirmed` y el hash si corresponde.

## Estructura del proyecto
```
src/
  App.jsx
  App.css
  components/
    ClaimReward.jsx
  utils/
    paymentService.js      # wallet_sendCalls, waitForBatchConfirmation
    walletProvider.js      # chequeos de capacidades (Paymaster)
    walletService.js       # Base Account SDK, conexión, cambio de red
```

## Troubleshooting
- **"Contract address or paymaster URL is missing."**
  - `src/components/ClaimReward.jsx` lee `VITE_REWARDS_CONTRACT_ADDRESS` y `VITE_PAYMASTER_SERVICE_URL`.
  - Revisa `.env` y reinicia el dev server.
- **URL de Paymaster inválida**
  - `src/utils/walletProvider.js` valida con `new URL(paymasterUrl)` y verifica capacidades con `wallet_getCapabilities`.
- **Provider nulo / getProvider() falla**
  - `src/utils/walletService.js` crea el SDK con `appChainIds: [baseSepolia.id]`. Evita usar referencias inexistentes.
- **No cambia a Base Sepolia**
  - Verifica `VITE_BASE_SEPOLIA_RPC_URL` y permisos del wallet para `wallet_addEthereumChain`.

## Stack
- **Frontend**: React + Vite
- **Wallet SDK**: `@base-org/account`
- **EVM utils**: `viem`

## Scripts
- **dev**: inicia Vite en modo desarrollo.
- Puedes agregar `build` y `preview` si lo necesitas.

## Créditos
- Coinbase Base – Paymaster & Base Account SDK
- Viem – utilidades EVM para JS
- Vite/React – tooling rápido para dApps
