/**
 * Escala de espaciado base 4px (consistente con NativeWind: p-1 = 4px).
 * Para className usa Tailwind (p-4, gap-3...); esto es para uso imperativo.
 */
export const spacing = {
  1: 4, // gap ícono ↔ texto
  2: 8, // padding interno de badges
  3: 12, // gap entre elementos relacionados
  4: 16, // padding estándar de cards y pantallas
  6: 24, // separación entre secciones
  8: 32, // separación entre bloques mayores
} as const;

/** Radios de borde. */
export const radius = {
  card: 16,
  button: 12,
  input: 10,
  badge: 999,
  avatar: 999,
} as const;

export type SpacingToken = keyof typeof spacing;
export type RadiusToken = keyof typeof radius;
