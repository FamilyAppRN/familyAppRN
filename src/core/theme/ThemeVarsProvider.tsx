import type { ReactNode } from 'react';
import { View } from 'react-native';

import { buildThemeVars } from '@shared/theme/buildThemeVars';
import { useAppColorScheme } from '@shared/theme/useAppColorScheme';

interface Props {
  children: ReactNode;
}

/**
 * Inyecta los --color-* del scheme EFECTIVO (preferencia de Ajustes, o
 * sistema) en el árbol que envuelve. Tiene prioridad de cascada sobre el
 * @media (prefers-color-scheme) de global.css — así es como el override
 * manual de tema funciona sin depender del esquema del SO.
 *
 * ⚠️ USAR DENTRO DE CADA SCREEN (envolviendo su SafeAreaView), NUNCA
 * envolviendo un navegador (<Stack>/<Tabs> raíz). Envolver <Stack> con esto
 * causó en nativo: "Couldn't find a navigation context" al cambiar de tema
 * (el toggle re-renderiza este View — al ser cssInterop-procesado por
 * `className`, y ancestro directo del NavigationContainer, algo en esa
 * combinación rompe el contexto de navegación; en web nunca reprodujo).
 * Si una pantalla vive fuera de un navegador con estilos propios (ej. el
 * tab bar en (main)/_layout.tsx), mezclar `buildThemeVars(scheme)` directo
 * en su `style` en vez de agregar un ThemeVarsProvider ahí.
 */
export function ThemeVarsProvider({ children }: Props) {
  const scheme = useAppColorScheme();

  return (
    <View style={buildThemeVars(scheme)} className="flex-1">
      {children}
    </View>
  );
}
