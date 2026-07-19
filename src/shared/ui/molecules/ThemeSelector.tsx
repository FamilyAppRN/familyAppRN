import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useThemeStore, type ThemePreference } from '@core/theme/useThemeStore';

const OPTIONS: ThemePreference[] = ['light', 'dark', 'system'];

// Sombra de shadow-card (tailwind.config.js) como style RN nativo, NO como
// className condicional: alternar clases `shadow-*` en un className dinámico
// dispara un bug conocido de NativeWind/cssInterop ("Couldn't find a
// navigation context" — nativewind/nativewind#1536, #1557, #1711) por el
// parseo de CSS en runtime que hace para esas utilidades. Con un style
// object estático (no involucra parseo de className) se evita el bug.
const activeShadowStyle = {
  shadowColor: '#171510',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 8,
};

/** Segmented control Claro/Oscuro/Sistema — cambia el tema de verdad (@core/theme). */
export function ThemeSelector() {
  const { t } = useTranslation();
  const preference = useThemeStore((s) => s.preference);
  const setPreference = useThemeStore((s) => s.setPreference);

  return (
    <View className="flex-row rounded-badge bg-surface-2 p-1">
      {OPTIONS.map((option) => {
        const isActive = preference === option;
        return (
          <Pressable
            key={option}
            accessibilityRole="button"
            onPress={() => setPreference(option)}
            style={isActive ? activeShadowStyle : undefined}
            className={`flex-1 items-center rounded-badge py-1.5 ${isActive ? 'bg-surface' : ''}`}>
            <Text
              className={`text-caption font-jakarta-bold ${
                isActive ? 'text-foreground' : 'text-muted'
              }`}>
              {t(`profile.theme.${option}`)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
