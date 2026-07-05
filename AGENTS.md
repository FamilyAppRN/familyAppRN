# Reglas del proyecto — familyAppRN

## ⚠️ Expo SDK 56 — lee los docs antes de escribir código

Esta versión de Expo tiene breaking changes respecto a tu training data. **Antes de escribir
código de Expo/Router/RN, lee los docs versionados:** https://docs.expo.dev/versions/v56.0.0/

## ⚠️ Node ≥ 24

El proyecto exige Node ≥ 20.19.4 (usamos 24). **Antes de cualquier comando** (`npm`, `npx expo …`):

```bash
nvm use 24
```

Con Node 20.12 (el default del sistema) los comandos de Expo fallan.

## Instalar sin Expo Go (build local)

Dos scripts (lógica común en `scripts/lib/expo-build.sh`):

```bash
# Emulador Android / Simulador iOS (iOS NO requiere firma)
npm run emulator:android
npm run emulator:ios
npm run emulator:both

# Teléfono físico por USB (iOS requiere Xcode + Apple ID para firma)
npm run device:android
npm run device:ios
npm run device:both
```

Añade `:release` para un build standalone (empaqueta el JS, sin Metro): p. ej. `npm run device:android:release`.
Un DEV build necesita Metro aparte: `npx expo start --dev-client`. Android requiere adb.

---

## Arquitectura

La arquitectura completa está en **`docs/ARQUITECTURA.md`** — léela antes de tocar `src/`.
Resumen operativo:

- **Features como frontera.** `src/features/<feature>/` autocontenido: `store/`, `domain/`, `data/`, `<subfeature>/`.
- **El hook orquesta, la screen pinta.** Lógica con estado → hook. Screen → solo layout.
- **Validar en el borde.** Lo que entra de la red se valida con **Zod** en `data/` (schema = DTO).
- **UseCase opcional.** El hook llama al repository directo. UseCase solo si hay lógica de negocio real o se orquestan varios repos.
- **DI manual.** Factory local con singleton perezoso (`data/<x>Factory.ts`). Nada de tsyringe / reflect-metadata.

### Estado
- Dato que viene/vuelve del servidor → **TanStack Query** (`useQuery`/`useMutation`).
- Estado propio del cliente (sesión, flags UI) → **Zustand** (`features/<f>/store/`).

### Capas y dependencias (no romper)
```
Route file (src/app) → solo importa y renderiza la Screen del feature. CERO lógica.
Screen               → @shared/ui + su hook + sus organismos.
Hook                 → useForm, zodResolver, useMutation/useQuery, useRouter, store, factory.
Repository           → su Api + schemas + mappers + @core (storage, network).
Api                  → @core/network/ApiClient.  ❌ NUNCA axios directo en features.
Organism             → @shared/ui + Controller de RHF + tipos del form schema.
Form schema          → solo zod.
```

### Innegociables
- ❌ **Sin `axios` directo en `features/`** → siempre vía `@core/network`.
- ✅ **Query keys como constantes** en `data/queryKeys.ts`. Nunca arrays inline.
- ✅ **Route file = wrapper delgado.** Solo importa la Screen.
- ❌ **Una sub-feature no importa de otra sub-feature hermana.** Sube la lógica a `domain`/`data`.
- ❌ **`shared` y `core` no dependen de `features`.**

---

## Convenciones técnicas

- **Aliases por `tsconfig.json`** (Metro nativo): `@core/*`, `@shared/*`, `@features/*`, `@/*`, `@tests/*`.
  - ❌ No instales `babel-plugin-module-resolver` para aliases. (`babel.config.js` ya existe, pero solo para NativeWind; no le agregues module-resolver.)
  - Tras cambiar aliases: `npx expo start -c`.
- **Rutas viven en `src/app/`** (no en la raíz). Es lo que detecta Expo Router en este template.
- **`BASE_URL` por entorno:** `process.env.EXPO_PUBLIC_API_URL` (ver `.env.example`). No hardcodear URLs.
- **Errores de red** se normalizan a `AppError` (`@core/errors`) en el interceptor. Features/UI no ven axios.
- **Zod v4**: `z.string().email()` funciona; puedes usar APIs nuevas de v4. Consistencia por feature.
- **Navegación:** `router.navigate()` por defecto en handlers de botones; `router.push()` para flujos donde el back importa; `router.replace()` para redirects (post-login, etc.).

---

## Componentes: Expo antes que React Native (OBLIGATORIO)

Expo trae componentes/APIs **optimizados por plataforma**. **Usa el de Expo si existe;**
recurre a RN **solo** cuando Expo no ofrezca equivalente.

| En vez de (RN) | Usa (Expo) | Nota |
| --- | --- | --- |
| `Image` de `react-native` | **`expo-image`** (`import { Image } from 'expo-image'`) | Caché y perf superiores. Usa `contentFit` (no `resizeMode`) y `transition`. |
| `StatusBar` de RN | **`expo-status-bar`** | |
| Gradientes manuales | **`expo-linear-gradient`** | |
| Blur | **`expo-blur`** | |
| `@react-navigation/*` directo | **`expo-router`** (y `expo-router/ui` para tab bars custom) | Ya es la base del proyecto. |
| Video / audio | **`expo-video`** / `expo-audio` | |
| Haptics, fonts, linking, localization | `expo-haptics`, `expo-font`, `expo-linking`, `expo-localization` | |

Primitivos sin equivalente en Expo (`View`, `Text`, `Pressable`, `ScrollView`, `FlatList`,
`TextInput`, `useColorScheme`, `Appearance`…) → RN, correcto.

Antes de usar un componente de RN, comprueba si hay un paquete `expo-*` que lo cubra.

## Sistema de diseño / UI

Detalle completo en **`docs/UI-UX.md`** (principios, tokens, componentes, pantallas, patrones).

- **UI kit: gluestack-ui v3 + NativeWind.** ⏳ Pendiente `npx gluestack-ui init` (al empezar primitives).
- **Estilos por `className`** con tokens de `tailwind.config.js`. ❌ Cero hex/spacing hardcodeado.
- **Tokens imperativos** (sombras nativas, color de avatar, etc.) desde `@shared/theme` (`src/shared/theme/tokens/`).
- **Dónde vive el UI** (mapeo, ❌ no crear `src/design-system/` ni `src/components/`):
  - Tokens → `src/shared/theme/tokens/`.
  - Primitives genéricos (Button, Input, Avatar, Badge, EmptyState…) → `src/shared/ui/`. **No conocen el dominio.**
  - Componentes de dominio (TaskCard, ShoppingItemRow…) → **dentro de su feature** `src/features/<f>/`.
- **Dark mode día 1:** usa nombres semánticos (`bg-base`, `bg-surface`, `text-foreground`, `text-muted`, `border-line`), no neutros directos.
- **Fuente:** Plus Jakarta Sans (`@expo-google-fonts/plus-jakarta-sans`). ⏳ Cargar con `useFonts` en el root layout.
- **Iconos:** `lucide-react-native`. **Creación de contenido** en `ActionSheet` (bottom sheet), nunca pantalla nueva (excepto onboarding). **Destructivas:** swipe/long-press + confirmación.

---

## Internacionalización (i18n) — OBLIGATORIA

La app es **bilingüe ES/EN**. Stack: `i18next` + `react-i18next` + `expo-localization` (config en `@core/i18n`).

- ❌ **Cero texto hardcodeado de cara al usuario.** Todo string visible va por `t('clave')` (`useTranslation`).
- ✅ **Toda clave nueva se agrega a AMBOS** `src/core/i18n/locales/es.json` y `en.json`. No dejar una sola sin su par.
- **Namespaces por feature/pantalla** (`welcome.*`, `login.*`, `register.*`, `home.*`, `validation.*`).
- **Mensajes de validación (Zod):** el schema guarda la **clave** (`'validation.email'`), y se traduce al mostrarse: `error={error?.message ? t(error.message) : undefined}`.
- Idioma inicial = locale del dispositivo (fallback `es`). Cambio en runtime con `useLanguage()` (`@core/i18n/useLanguage`) o el primitive `LanguageSwitch`.
- El idioma se inicializa importando `@core/i18n/i18n` en el root layout (ya hecho).

## Scaffolding del template (no construir encima)
`src/components/`, `src/hooks/`, `src/constants/`, `src/global.css` son del template de arranque (demo).
No bases features en ellos; migra a `shared/` lo que sirva cuando trabajes las vistas.

## Checklist feature nueva
Ver `docs/ARQUITECTURA.md` § "Checklist: agregar una feature nueva".

## Commits (sugerido, no bloqueante)
`type(scope): descripción en imperativo` — tipos: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `build`, `ci`.
