# Arquitectura — familyAppRN (React Native + Expo SDK 56)

> Esta es la versión **aplicada a este repo** de la arquitectura MVP DDD + Clean (ligera).
> El documento fuente vive en `~/Documents/ProyectosGalileo/arquitectura-app-react-native-clean-ddd.md`.
> Aquí se registran las **adaptaciones reales** de este proyecto frente a ese documento.

## Filosofía (no negociable)

- **Features como frontera.** Cada dominio (auth, family, tasks…) es autocontenido.
- **El hook orquesta, la screen pinta.** Toda la lógica con estado vive en el hook; la screen es layout.
- **Validar en el borde.** Todo lo que entra de la red se valida con Zod una vez, en `data`.
- **UseCase opcional.** El hook llama al repository directo. Solo hay UseCase cuando hay lógica de negocio real.
- **DI manual.** Factories locales con singleton perezoso. Sin contenedores, sin decoradores, sin `reflect-metadata`.

---

## Adaptaciones de este repo (diferencias vs el documento fuente)

| Tema | Documento fuente | En este repo | Motivo |
| --- | --- | --- | --- |
| Ubicación de rutas | `app/` en la raíz | **`src/app/`** | El template SDK 56 ya usa `src/app`; Expo Router lo detecta. |
| Aliases | `babel-plugin-module-resolver` | **`tsconfig.json` paths** | Metro en SDK 56 soporta paths nativamente. No instalamos el plugin de babel. |
| `index.js` entry | `import 'expo-router/entry'` | `"main": "expo-router/entry"` en `package.json` | Convención del template SDK 56. No hay `index.js`. |
| `BASE_URL` | Hardcode en `apiClient.ts` | **`process.env.EXPO_PUBLIC_API_URL`** | Config por entorno. Ver `.env.example`. |
| Versión de Zod | (no especificada) | **Zod v4** (`^4.x`) | Usar `z.email()` / `z.string().email()` según convenga (ver nota Zod abajo). |
| Node | (no especificada) | **Node ≥ 24** (`nvm use 24`) | SDK 56 exige Node ≥20.19.4; en esta máquina usamos 24. |

### Nota Node
El proyecto **requiere Node ≥ 20.19.4** (usamos 24 vía nvm). Antes de cualquier comando de Expo:
```bash
nvm use 24
```

### Nota Zod v4
Estamos en Zod 4. `z.string().email()` sigue funcionando. Para schemas nuevos puedes usar
las APIs de v4 (`z.email()`, `z.iso.date()`, etc.). Mantén consistencia dentro de cada feature.

---

## Stack instalado

| Necesidad | Librería | Versión |
| --- | --- | --- |
| Routing | Expo Router (`src/app/`) | SDK 56 |
| Estado servidor | TanStack Query | ^5 |
| Estado cliente | Zustand | ^5 |
| Formularios | React Hook Form + @hookform/resolvers | ^7 / ^5 |
| Validación API/forms | Zod | ^4 |
| Red | Axios | ^1 |
| Persistencia | @react-native-async-storage/async-storage | 2.2.0 |
| DI | Factories locales (`new` + singleton) | — |
| UI kit | gluestack-ui v3 (⏳ `npx gluestack-ui init` pendiente) | v3 |
| Estilos | NativeWind + tailwindcss | ^4.2 / 3.4.17 |
| Tipografía | @expo-google-fonts/plus-jakarta-sans + expo-font | — |
| Iconos | lucide-react-native + react-native-svg | — |

> Sistema de diseño (tokens, componentes, pantallas, patrones): ver **`docs/UI-UX.md`**.

---

## Estructura de carpetas (real)

```text
src/
├── app/                  # Expo Router — wrappers delgados (rutas)
│   ├── _layout.tsx       # root: QueryProvider + ThemeProvider
│   ├── index.tsx
│   └── ...
├── core/                 # infraestructura transversal
│   ├── network/          # apiClient (ApiClient interface), interceptors
│   ├── storage/          # StorageService
│   ├── providers/        # QueryProvider
│   └── errors/           # AppError + normalizeError
├── shared/
│   ├── ui/               # primitives genéricos (wrappers de gluestack). NO conocen el dominio.
│   └── theme/
│       └── tokens/       # colors, typography, spacing, shadows (uso imperativo)
├── features/
│   └── <feature>/
│       ├── store/        # zustand del feature
│       ├── domain/       # models (interfaces puras) + useCases (opcionales)
│       ├── data/         # api, schemas, mappers, repository, queryKeys, factory
│       └── <subfeature>/ # <Sub>FormSchema.ts, use<Sub>.ts, <Sub>Screen.tsx, organisms/
│
├── components/  hooks/  constants/   # ⚠️ scaffolding del template (demo). Se reemplaza al hacer vistas.
```

> `components/`, `hooks/`, `constants/` y `global.css` son del template de arranque.
> No construyas features sobre ellos: migra lo que sirva a `shared/` cuando toque las vistas.

---

## Aliases

| Alias | Apunta a |
| --- | --- |
| `@/*` | `src/*` (heredado del template) |
| `@core/*` | `src/core/*` |
| `@shared/*` | `src/shared/*` |
| `@features/*` | `src/features/*` |
| `@tests/*` | `tests/*` |

Configurados en `tsconfig.json`. Tras editarlos, **reinicia Metro** (`npx expo start -c`).

---

## Reglas de dependencias entre capas

```text
Route file (src/app) → solo importa la Screen del feature (wrapper delgado, sin lógica).
Screen               → @shared/ui + su hook + sus organismos.
Hook                 → useForm, zodResolver, useMutation/useQuery, useRouter, store, factory del feature.
Repository           → su Api + schemas + mappers + @core (storage, network).
Api                  → @core/network/ApiClient (NUNCA axios directo en features).
Organism             → @shared/ui + Controller de RHF + tipos de su form schema.
Form schema          → solo zod.
```

Innegociables:
- **Sin `axios` directo dentro de `features/`.** Siempre vía `@core/network`.
- **Query keys como constantes** en `data/queryKeys.ts`, nunca arrays inline.
- **El route file no tiene lógica.** Solo importa y renderiza la screen.
- **Una sub-feature no importa de una sub-feature hermana.** Sube la lógica a `domain`/`data`.
- **`shared` y `core` no dependen de `features`.**

Todo lo demás (UseCase, mapper, separación atómica fina) es **opcional**: úsalo cuando el código lo pida.

---

## Flujo de datos (referencia rápida)

```
Screen → useHook → Repository → Api → ApiClient(axios) → red
                       ↓
                 Zod.parse (valida)
                       ↓
                  Mapper.toDomain (snake_case → camelCase)
                       ↓
              modelo de dominio (interface pura)
```

Servidor ⇄ TanStack Query. Estado de cliente (sesión, flags UI) ⇄ Zustand.

---

## Checklist: agregar una feature nueva

1. `domain/models/<Modelo>.ts` — interface pura.
2. `data/api/<X>Api.ts` — métodos contra el `ApiClient`.
3. `data/schemas/<x>Schema.ts` — response schema Zod.
4. `data/mappers/<X>Mapper.ts` — snake_case → camelCase (si hace falta).
5. `data/repository/<X>Repository.ts` — Api + validación + mapping + storage.
6. `data/queryKeys.ts` — keys como constantes.
7. `data/<x>Factory.ts` — singleton perezoso del repository.
8. (Opcional) `domain/useCases/` — solo si hay lógica de negocio.
9. Sub-feature: `<sub>FormSchema.ts`, `use<Sub>.ts`, `<Sub>Screen.tsx`, `organisms/<Sub>Form.tsx`.
10. Route file en `src/app/`.

---

## Cuándo graduar a la arquitectura estricta

Migra a la versión full (UseCase obligatorio, DI con contenedor, monorepo, coverage forzado) si aparece:
una segunda app que comparte `core`/`domain`; más de una persona tocando el código a diario;
lógica de negocio repetida entre features; o requisitos de auditoría que pidan cobertura.
