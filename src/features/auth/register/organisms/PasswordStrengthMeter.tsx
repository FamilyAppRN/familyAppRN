import { Text, View } from 'react-native';
import { Check, Circle } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { palette, semanticColors } from '@shared/theme/tokens';
import { useAppColorScheme } from '@shared/theme/useAppColorScheme';

interface Props {
  password: string;
}

// Requisitos visibles, en el mismo orden y con la misma regla que el backend.
const REQUIREMENTS = [
  { key: 'length', test: (v: string) => v.length >= 8 },
  { key: 'case', test: (v: string) => /[a-z]/.test(v) && /[A-Z]/.test(v) },
  { key: 'number', test: (v: string) => /\d/.test(v) },
  { key: 'symbol', test: (v: string) => /[@$!%*?&]/.test(v) },
] as const;

/** Barra de avance + lista de requisitos que se marcan mientras se escribe. */
export function PasswordStrengthMeter({ password }: Props) {
  const { t } = useTranslation();
  const scheme = useAppColorScheme();
  const metCount = REQUIREMENTS.filter(({ test }) => test(password)).length;

  return (
    <View className="mt-2 gap-2">
      <View className="flex-row gap-1" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {REQUIREMENTS.map(({ key }, index) => (
          <View key={key} className={`h-1 flex-1 rounded-full ${index < metCount ? 'bg-brand-600' : 'bg-line'}`} />
        ))}
      </View>
      <View className="flex-row flex-wrap gap-x-3 gap-y-1">
        {REQUIREMENTS.map(({ key, test }) => {
          const met = test(password);
          return (
            <View
              key={key}
              accessibilityLabel={`${t(`register.rules.${key}`)}: ${t(met ? 'register.rules.met' : 'register.rules.missing')}`}
              className="w-[47%] flex-row items-center gap-1.5">
              {met ? (
                <Check size={14} color={semanticColors[scheme].emphasis} strokeWidth={3} />
              ) : (
                <Circle size={12} color={palette.neutral[400]} />
              )}
              <Text className={`text-caption ${met ? 'font-jakarta-semibold text-emphasis' : 'font-sans text-muted'}`}>
                {t(`register.rules.${key}`)}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
