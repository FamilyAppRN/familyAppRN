import { useColorScheme as useSystemColorScheme } from 'react-native';
import { useThemeStore } from '@core/theme/useThemeStore';

/**
 * Lee el scheme efectivo UNA VEZ por render, SIN suscribirse a cambios
 * futuros (a diferencia de `useAppColorScheme`, que sí se suscribe). Usar
 * SOLO en componentes que envuelven un navegador (<Stack>/<Tabs>) — ahí un
 * hook reactivo revienta la navegación en nativo ("Couldn't find a
 * navigation context") al re-renderizar el ancestro cuando cambia el tema.
 * Ver la nota larga en `_layout.tsx` / `(main)/_layout.tsx`.
 */
export function useInitialColorScheme(): 'light' | 'dark' {
  const preference = useThemeStore.getState().preference;
  const system = useSystemColorScheme();
  const resolved = preference === 'system' ? system : preference;
  return resolved === 'dark' ? 'dark' : 'light';
}
