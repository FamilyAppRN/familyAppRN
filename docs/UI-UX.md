# UI/UX & Sistema de Diseño — familyAppRN (Asistente Familiar Collab)

> Versión **adaptada a NUESTRA arquitectura** del brief de UI/UX original.
> Fuente: `~/Downloads/asistente-familiar-uiux-diseno.md`.
> ⚠️ El doc original proponía `src/design-system/` + `src/components/<feature>/` y *gluestack-ui*.
> Aquí se respeta la arquitectura ya montada (ver `docs/ARQUITECTURA.md`): los tokens viven en
> `src/shared/theme/`, los primitives genéricos en `src/shared/ui/`, y los componentes de dominio
> dentro de cada `src/features/<feature>/`. **NO** se crean carpetas `design-system/` ni `components/`.

---

## 1. Principios de diseño del producto

| Principio | En la práctica |
|---|---|
| **Cero fricción** | Cada acción primaria (agregar item, marcar tarea) en 1 tap. Nada de flujos de 3 pantallas. |
| **Claridad sobre densidad** | La usan papás, abuelos y niños. Tipografía grande, contraste alto, iconos reconocibles antes que texto. |
| **Tiempo real visible** | Avatares de quién hizo qué, "alguien está escribiendo", animaciones sutiles al sincronizar. |
| **Mobile-first, una mano** | Acciones más usadas alcanzables con el pulgar en la mitad inferior. |
| **Premium se siente, no se impone** | Features premium con badge sutil, nunca un modal agresivo en cada tap. |

---

## 2. Tokens de diseño — IMPLEMENTADOS

Dos fuentes coordinadas (mantener en sync):
- **`tailwind.config.js`** → canónico para estilos por `className` (NativeWind).
- **`src/shared/theme/tokens/*.ts`** → para estilos imperativos / lógica JS (sombras nativas, color de avatar, etc.).

### Color
Marca verde salvia (`brand-500 #4F9E6B`), acento coral (`accent-500 #FF7A47`), funcionales
(`success`/`warning`/`danger`) y neutros. Ver `src/shared/theme/tokens/colors.ts`.

**Dark mode (día 1):** usa nombres **semánticos**, no neutros directos:
`bg-base`, `bg-surface`, `text-foreground`, `text-muted`, `border-line`.
Resuelven light/dark vía CSS vars en `src/global.css` (switch con clase `dark` en root).
> ⚠️ El switch de dark mode en nativo debe verificarse al correr la app por primera vez.

### Tipografía — Plus Jakarta Sans
Familias registradas: `PlusJakartaSans_400Regular` / `_600SemiBold` / `_700Bold`.
Escala (`text-display`/`h1`/`h2`/`body`/`caption`/`button`) en `tailwind.config.js` y `tokens/typography.ts`.
> ⏳ Pendiente: cargar las fuentes con `useFonts` en el root layout (al construir el Splash).

### Espaciado / Radios / Sombras
Base 4px (Tailwind nativo: `p-1`=4px). Radios: `rounded-card` 16 / `rounded-button` 12 /
`rounded-input` 10 / `rounded-badge` 999. Sombras `shadow-card` / `shadow-modal`
(+ objetos nativos en `tokens/shadows.ts`).

### Iconografía
`lucide-react-native` (+ `react-native-svg`). 20px en listas, 24px en headers/tabs, 16px inline.
Regla: un ícono por categoría de producto en la lista de compras (verduras, lácteos, limpieza…).

---

## 3. Componentes base (sobre gluestack-ui v3 + NativeWind)

> ⏳ **Pendiente de inicializar:** `npx gluestack-ui init` (scaffolda provider + componentes).
> Se hará al empezar los primitives. Los wrappers genéricos vivirán en `src/shared/ui/`.

| Primitive (`@shared/ui`) | Base gluestack | Customización |
|---|---|---|
| `Button` | `Button` | Variantes `primary`/`secondary`/`danger`/`ghost`. Estado `loading` con spinner inline. |
| `Input` | `Input` | Estados de error inline (no toast). |
| `Checkbox` | `Checkbox` | Al marcar: tachado + fade a `text-muted`. Swipe-to-delete con gesture-handler. |
| `Avatar` | `Avatar` | Fallback con iniciales + color determinístico por `user_id` (mismo user = mismo color). |
| `Badge` | `Badge` | Variante `premium` con gradiente accent-400→accent-600 + estrella. |
| `Toast` | `Toast` | Confirmaciones de sync, 2s, sin acción. |
| `ActionSheet` | `Actionsheet` | "Agregar item/tarea": siempre desde abajo (alcance del pulgar). |
| `EmptyState` | Custom | Ilustración + texto + CTA. |

**Regla de oro:** los primitives de `@shared/ui` **no conocen el dominio** (no saben qué es una
"tarea" o un "hogar"). Los componentes que sí lo conocen (`TaskCard`, `ShoppingItemRow`) viven
**dentro de su feature** (`src/features/<feature>/`) y componen primitives.

---

## 4. Dónde vive cada cosa (mapeo a nuestra arquitectura)

| Concepto del brief original | En este repo |
|---|---|
| `src/design-system/tokens/` | `src/shared/theme/tokens/` ✅ creado |
| `src/design-system/primitives/` | `src/shared/ui/` (Button, Input, Avatar, Badge, EmptyState…) |
| `src/components/shopping/` etc. | `src/features/shopping/` (componentes de dominio dentro del feature) |
| `src/components/shared/` (ScreenHeader, SyncIndicator…) | `src/shared/ui/` si son genéricos; si conocen dominio → su feature |

---

## 5. Pantallas a construir (roadmap por etapas)

**Etapa 0 — Setup visual:** tokens ✅ · fuentes (cargar con useFonts) · primitives (`shared/ui`) ·
opcional: pantalla interna de preview de primitives.

**Etapa 1 — Onboarding & Auth:** Splash · Login · Registro (RHF + Zod) · Crear/Unirse a Hogar
(código OTP 6 dígitos, unirse en <3 taps).

**Etapa 2 — Shopping List (core):** Home con header (nombre hogar + avatares + SyncIndicator),
lista agrupada por categoría colapsable, `ShoppingItemRow` (checkbox + cantidad + avatar), FAB →
AddItemSheet (no se cierra al agregar, autocompletado de categoría). Swipe izquierda = eliminar.

**Etapa 3 — Tareas:** filtros "Todas/Mías/Completadas", `TaskCard` (checkbox grande, asignado,
fecha), FAB, tap en avatar sin asignar → AssignMemberSheet.

**Etapa 4 — Notas rápidas:** feed post-it, fijadas arriba, `ComposeNoteBar` fija abajo
(única excepción a "todo en sheet"), contador de expiración en no fijadas.

**Etapa 5 — Premium (Fase 2):** Paywall (nunca interrumpe flujo activo), Calendario familiar
(`react-native-calendars`), Multihogar switcher.

**Etapa 6 — IA (Fase 3):** Menú semanal IA (inyecta ingredientes a la lista), Nota de voz → tarea
(siempre revisión del usuario antes de crear).

---

## 6. Patrones de interacción transversales (consistentes en toda la app)

| Patrón | Regla |
|---|---|
| Acciones destructivas | Swipe o long-press + confirmación. Nunca un tap accidental borra. |
| Creación de contenido | Siempre bottom sheet (`ActionSheet`), nunca pantalla nueva — excepto onboarding y "Nuevo producto" (ver abajo). |
| Sincronización | Optimista en UI primero; rollback silencioso si falla. |
| Avatares | Mismo color por usuario en toda la app (determinístico por `user_id`). |
| Estados vacíos | Nunca pantalla en blanco: siempre `EmptyState` con CTA. |
| Pull to refresh | En las 3 listas core (shopping, tasks, notes) como respaldo manual. |

> **Excepción aprobada — "Nuevo producto" (Compras).** Se implementó como pantalla
> completa, no como bottom sheet, por decisión de diseño sobre el mockup aprobado:
> el formulario tiene 4 campos (nombre, cantidad, unidad, categoría) y no entra
> cómodo en una hoja. Vive en `src/app/(modals)/new-shopping-item.tsx` — fuera del
> grupo `(main)` a propósito, para que el `<Stack>` raíz la monte por encima del
> tab bar. Es la única ruta del proyecto fuera de `(auth)`/`(main)` y el único uso
> de `router.push`/`router.back`. No "corregir" a ActionSheet sin volver a decidirlo.

---

## 7. Checklist de entrega por pantalla

- [ ] Solo tokens del sistema de diseño (cero hex/spacing hardcodeado).
- [ ] Estado vacío + con datos + error definidos.
- [ ] Responde a real-time sin refrescar manual.
- [ ] Soporta dark mode (verificar contraste real).
- [ ] Acciones táctiles en la mitad inferior cuando se pueda.
- [ ] Probado en pantalla pequeña (iPhone SE / Android gama media) sin overflow.

---

## 8. Plantilla de prompt para construir una pantalla

```
Construye la pantalla <PANTALLA> de familyAppRN (Expo, nuestra arquitectura por features).
Sigue docs/ARQUITECTURA.md y docs/UI-UX.md. UI: gluestack-ui v3 + NativeWind.

Reglas:
- Tokens: brand #4F9E6B, accent #FF7A47, funcionales y neutros (tailwind.config.js / shared/theme).
- Tipografía Plus Jakarta Sans; espaciado base 4px; rounded-card 16, rounded-button 12.
- Estados obligatorios: vacío, con datos, error, sincronizando.
- Creación en ActionSheet (bottom sheet), nunca pantalla nueva.
- Destructivas: swipe-to-delete + confirmación.
- Componer con primitives de @shared/ui; componentes de dominio dentro del feature.
- Lógica con estado en el hook; la screen solo pinta.
```
