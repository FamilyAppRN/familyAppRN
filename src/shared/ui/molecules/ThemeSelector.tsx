import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useThemeStore, type ThemePreference } from '@core/theme/useThemeStore';

const OPTIONS: ThemePreference[] = ['light', 'dark', 'system'];

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
            className={`flex-1 items-center rounded-badge py-1.5 ${
              isActive ? 'bg-surface shadow-card' : ''
            }`}>
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
