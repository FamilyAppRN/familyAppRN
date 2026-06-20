/**
 * Escala tipográfica. Fuente: Plus Jakarta Sans (vía @expo-google-fonts).
 * Los nombres de familia coinciden con las claves registradas en useFonts.
 */
export const fontFamily = {
  regular: 'PlusJakartaSans_400Regular',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
} as const;

/** Escala de tamaños/pesos para uso imperativo (StyleSheet, props de Text). */
export const typography = {
  display: { fontSize: 32, fontFamily: fontFamily.bold }, // onboarding, empty states
  h1: { fontSize: 24, fontFamily: fontFamily.bold }, // título de pantalla
  h2: { fontSize: 18, fontFamily: fontFamily.semibold }, // título de sección
  body: { fontSize: 16, fontFamily: fontFamily.regular }, // texto general
  bodyStrong: { fontSize: 16, fontFamily: fontFamily.semibold }, // nombres, títulos card
  caption: { fontSize: 13, fontFamily: fontFamily.regular }, // metadata
  button: { fontSize: 16, fontFamily: fontFamily.semibold },
} as const;

export type TypographyToken = keyof typeof typography;
