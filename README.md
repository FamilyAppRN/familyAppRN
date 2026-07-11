# Gestia

App móvil de gestión familiar colaborativa (React Native + Expo Router). Un hogar, varios
miembros: listas de compras, tareas, notas — todo compartido en tiempo real.

- **Bundle ID / package:** `com.familycollab.gestia`
- **Scheme:** `gestia://`
- **Backend:** repo aparte ([family-backend](../family-backend)), ElysiaJS + MongoDB + Firebase Auth,
  desplegado en `https://family-backend-vvnp.onrender.com` (Swagger en `/docs`).

## Stack

- **Expo SDK 56** + **Expo Router** (file-based routing, `src/app/`)
- **NativeWind v4** (Tailwind para RN) — dark mode automático vía `prefers-color-scheme`
- **TanStack React Query** (estado de servidor) + **Zustand** (estado de auth en memoria)
- **React Hook Form + Zod** (formularios y validación, alineada 1:1 con el backend)
- **Axios** con interceptores (inyección de token, logging de requests en DEV, normalización de errores)
- **expo-secure-store** (tokens en Keychain/Keystore) + **AsyncStorage** (perfil no sensible)
- **i18next** (ES/EN, detecta el idioma del dispositivo)
- **@react-native-firebase/app** (el backend gestiona Firebase Auth; el cliente no usa su SDK para login)

## Arquitectura

Feature-based, DDD ligero. Cada feature es autocontenido: `domain/` (modelos), `data/` (api,
schemas Zod, mappers, repository), y la screen + hook de presentación (el hook orquesta, la
screen solo pinta). `core/` tiene la infraestructura transversal: red, storage, sesión, i18n,
logger, errores. `shared/` tiene UI reusable (átomos, moléculas) y tokens de diseño.

Detalle completo y decisiones tomadas: [`docs/ARQUITECTURA.md`](docs/ARQUITECTURA.md) ·
sistema visual: [`docs/UI-UX.md`](docs/UI-UX.md).

```
src/
├── app/                  # rutas (Expo Router) — (auth)/ y (main)/
├── core/                 # network, storage, session, i18n, logger, errors, firebase
├── features/
│   ├── auth/             # welcome, login, register, sesión persistida
│   └── household/        # onboarding de hogar (crear / unirse con código)
└── shared/
    ├── ui/                # componentes reusables (Button, TextField, ...)
    └── theme/             # tokens de color/tipografía
```

## Requisitos

- **Node ≥ 24** (`.nvmrc` incluido — `nvm use`). Con la versión por defecto del sistema, Expo SDK 56 falla.
- Xcode (iOS) y/o Android Studio + SDK (Android) para builds nativos.
- Un `.env` local (ver `.env.example`) con `EXPO_PUBLIC_API_URL` apuntando al backend.

## Empezar

```bash
nvm use
npm install
cp .env.example .env   # y completar EXPO_PUBLIC_API_URL
```

## Correr la app

Este proyecto **no usa Expo Go** — algunos módulos (Firebase, SecureStore) requieren un
dev-client compilado. Dos scripts (lógica común en `scripts/lib/expo-build.sh`):

```bash
# Emulador Android / Simulador iOS (iOS no requiere firma)
npm run emulator:android
npm run emulator:ios
npm run emulator:both

# Teléfono físico por USB (iOS requiere Xcode + Apple ID para firma)
npm run device:android
npm run device:ios
npm run device:both
```

Cada uno compila, instala **y** deja Metro corriendo en la misma terminal (`Ctrl+C` para salir) —
no hace falta un segundo comando. Si un Metro de una corrida anterior quedó ocupando el puerto, el
script lo libera solo antes de compilar.

Agrega `:release` para un build standalone (JS empaquetado, sin Metro): p. ej.
`npm run device:android:release`.

### Solo el bundler web (sin nativo)

```bash
npm run web
```

## Scripts

| Comando | Qué hace |
| --- | --- |
| `npm run device:<plataforma>[:release]` | Build + instalación en dispositivo físico por USB |
| `npm run emulator:<plataforma>[:release]` | Build + instalación en emulador/simulador |
| `npm run web` | Bundler web (react-native-web) |
| `npm run lint` | ESLint (`expo lint`) |

## Convenciones del proyecto

Reglas obligatorias (Expo antes que React Native puro, i18n sin strings hardcodeados, checklist
de feature nueva, etc.) viven en [`AGENTS.md`](AGENTS.md) — léelo antes de tocar código.

⚠️ **`src/components/`, `src/hooks/`, `src/constants/` son del template de arranque (demo)** —
no bases features nuevas ahí; migra a `shared/` lo que sirva.

⚠️ **No corras `npm run reset-project`** — es boilerplate de `create-expo-app` que mueve/borra
`src/` y `scripts/` completos (todo el código real de la app) para volver a un scaffold en blanco.
Queda en el repo por defecto del template; no tiene uso en este proyecto.
