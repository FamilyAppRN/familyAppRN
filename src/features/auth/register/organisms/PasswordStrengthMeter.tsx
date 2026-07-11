import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { passwordScore } from '@features/auth/register/passwordRules';

interface Props {
  password: string;
}

// Índice = score (0-5, una por cada regla cumplida). Colores fijos: success/
// warning/danger tienen buen contraste en ambos temas por ser tonos medios.
const LEVEL_BY_SCORE = [
  { key: 'weak', width: '8%', barClass: 'bg-danger-500', labelClass: 'text-danger-500' },
  { key: 'weak', width: '20%', barClass: 'bg-danger-500', labelClass: 'text-danger-500' },
  { key: 'fair', width: '40%', barClass: 'bg-warning-500', labelClass: 'text-warning-700' },
  { key: 'fair', width: '60%', barClass: 'bg-warning-500', labelClass: 'text-warning-700' },
  { key: 'good', width: '80%', barClass: 'bg-brand-500', labelClass: 'text-emphasis' },
  { key: 'strong', width: '100%', barClass: 'bg-success-500', labelClass: 'text-success-700' },
] as const;

export function PasswordStrengthMeter({ password }: Props) {
  const { t } = useTranslation();
  if (!password) return null;

  const level = LEVEL_BY_SCORE[passwordScore(password)];

  return (
    <View className="mt-2 gap-1">
      <View className="h-1.5 w-full overflow-hidden rounded-full bg-line">
        <View className={`h-full rounded-full ${level.barClass}`} style={{ width: level.width }} />
      </View>
      <Text className={`text-caption font-sans ${level.labelClass}`}>
        {t(`register.strength.${level.key}`)}
      </Text>
    </View>
  );
}
