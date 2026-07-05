/**
 * Paleta de color — fuente para uso IMPERATIVO (lógica JS: color de avatar
 * determinístico, charts, etc.). Para estilos por className, la fuente es
 * `tailwind.config.js` (debe mantenerse en sync con estos valores).
 *
 * Marca: verde salvia (hogar). Acento: coral cálido. + funcionales y neutros.
 */
export const palette = {
  brand: {
    50: '#F1F8F4',
    100: '#DCEFE2',
    300: '#9BCFAE',
    500: '#4F9E6B', // primario
    600: '#3D7F54',
    700: '#2E6240',
    900: '#1A3A26',
  },
  accent: {
    400: '#FF9D6C',
    500: '#FF7A47', // premium badge, highlights
    600: '#E85F2C',
  },
  success: { 100: '#DCF5E3', 500: '#22A357', 700: '#15723D' },
  warning: { 100: '#FFF3DC', 500: '#E8A93D', 700: '#A8731D' },
  danger: { 100: '#FDE2E1', 500: '#E5483F', 700: '#A82E27' },
  neutral: {
    0: '#FFFFFF',
    50: '#FAFAF8',
    100: '#F2F1ED',
    200: '#E4E2DB',
    400: '#9C988E',
    600: '#5C594F',
    800: '#332F28',
    950: '#171510',
  },
} as const;

/**
 * Tokens semánticos por esquema. Usa SIEMPRE estos nombres en componentes
 * (`bg-surface`, `text-primary`...) en vez de referenciar neutros directos,
 * para poder invertir light/dark sin tocar cada componente.
 */
export const semanticColors = {
  light: {
    bgBase: '#FAFAF8',
    bgSurface: '#FFFFFF',
    surface2: '#F2F1ED',
    textPrimary: '#171510',
    textSecondary: '#5C594F',
    textFaint: '#9C988E',
    emphasis: '#2E6240',
    chip: '#DCEFE2',
    border: '#E4E2DB',
    borderStrong: '#E4E2DB',
  },
  dark: {
    bgBase: '#171510',
    bgSurface: '#211E17', // tarjeta elevada (no plana)
    surface2: '#332F28',
    textPrimary: '#FAFAF8',
    textSecondary: '#9C988E',
    textFaint: '#6F6A5D',
    emphasis: '#9BCFAE',
    chip: '#212E20',
    border: '#332F28',
    borderStrong: '#46413A',
  },
} as const;

export type ColorScheme = keyof typeof semanticColors;
