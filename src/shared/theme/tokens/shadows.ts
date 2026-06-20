import { Platform } from 'react-native';

/**
 * Sombras nativas (RN no usa box-shadow). Suaves, coherentes con "hogar".
 * En web/NativeWind también existe `shadow-card`/`shadow-modal` vía tailwind.
 */
export const shadows = {
  card: Platform.select({
    ios: {
      shadowColor: '#171510',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    android: { elevation: 2 },
    default: {},
  }),
  modal: Platform.select({
    ios: {
      shadowColor: '#171510',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
    },
    android: { elevation: 8 },
    default: {},
  }),
} as const;

export type ShadowToken = keyof typeof shadows;
