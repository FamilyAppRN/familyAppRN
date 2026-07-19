import { useColorScheme as useSystemColorScheme } from 'react-native';
import { useThemeStore } from '@core/theme/useThemeStore';

/**
 * Scheme EFECTIVO ('light'|'dark'): la preferencia elegida en Ajustes → Tema,
 * o el del sistema (reactivo a cambios en vivo) si la preferencia es
 * 'system'. Usar este hook en cualquier estilo imperativo condicionado por
 * tema — className ya lo resuelve solo vía <ThemeVarsProvider>.
 */
export function useAppColorScheme(): 'light' | 'dark' {
  const preference = useThemeStore((s) => s.preference);
  const system = useSystemColorScheme();
  const resolved = preference === 'system' ? system : preference;
  return resolved === 'dark' ? 'dark' : 'light';
}
