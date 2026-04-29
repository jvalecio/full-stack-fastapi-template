# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev           # Start dev server (http://localhost:5173)
npm run build         # tsc then Vite production build
npm run lint          # Biome linter with auto-fix (--apply-unsafe)
npm run generate-client  # Regenerate OpenAPI TypeScript client from backend schema
npx playwright test   # Run e2e tests (requires running backend)
```

## Tech Stack

- **React 18 + TypeScript** SPA, bundled with **Vite 6** (SWC)
- **TanStack Router 1.x** — file-based routing; routes auto-generated into `src/routeTree.gen.ts` (do not edit manually)
- **TanStack Query 5.x** — all server state; mutations trigger 401/403 redirects on auth failure
- **XYFlow 12.x** (React Flow successor) — P&ID diagram canvas
- **Chakra UI 3.x** — component library; extended wrappers live in `src/components/ui/`
- **Biome** — linter and formatter (replaces ESLint + Prettier); double quotes, no semicolons
- **OpenAPI client** auto-generated in `src/client/` — run `generate-client` after backend schema changes

## Architecture

### Routing & Auth

Routes live under `src/routes/`. The `/_layout` route wraps all protected pages and enforces auth via a `beforeLoad` hook that checks `isLoggedIn()` from localStorage; unauthenticated users are redirected to `/login`.

```
/_layout
  /           → P&ID Process Control dashboard
  /control    → Process controllers & gauges
  /items      → Items CRUD
  /admin      → User management (superuser only)
  /settings   → User settings
/login, /signup, /recover-password, /reset-password  (public)
```

### P&ID Diagram System

The main feature. `src/components/Process/IndustrialDiagram.tsx` is the XYFlow canvas wrapper. Devices are registered as custom node types and rendered by components in `src/components/Process/Devices/`.

**Device pattern:** Each device component extends XYFlow's `NodeProps` and receives a `base` prop typed as `DeviceBaseProps`. `DeviceBase.tsx` handles the shared logic: SVG rendering, handle positions (connection ports), Space+drag rotation, draggable labels, and click-to-toggle state. Specific devices (Tank, Pump, Valve, SensorNode, etc.) compose `DeviceBase` with their SVG asset and port configuration.

Handles (connection ports) are configured as an array passed to `DeviceBase`; the count and layout are arbitrary — `n-rotation` branch added support for any number of handles.

Diagram state (nodes + edges) is persisted to `localStorage`.

### Data Flow

All API calls use the auto-generated client in `src/client/` with Axios under the hood. TanStack Query wraps these in `useQuery`/`useMutation` hooks. The `VITE_API_URL` env var sets the backend base URL.

### Path Alias

`@/` maps to `src/` (configured in both `vite.config.ts` and `tsconfig.json`).
