import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

interface Props {
  password: string;
}

// Mismas 4 reglas que registerFormSchema (longitud, número, mayúscula, símbolo).
const RULES: Array<(v: string) => boolean> = [
  (v) => v.length > 5,
  (v) => /[0-9]/.test(v),
  (v) => /[A-Z]/.test(v),
  (v) => /[^A-Za-z0-9]/.test(v),
];

function getScore(password: string): number {
  return RULES.reduce((score, rule) => score + (rule(password) ? 1 : 0), 0);
}

// Índice = score (0-4). barClass usa colores fijos (success/warning/danger ya
// tienen buen contraste en ambos temas por ser tonos medios saturados).
const LEVEL_BY_SCORE = [
  { key: 'weak', width: '10%', barClass: 'bg-danger-500', labelClass: 'text-danger-500' },
  { key: 'weak', width: '25%', barClass: 'bg-danger-500', labelClass: 'text-danger-500' },
  { key: 'fair', width: '50%', barClass: 'bg-warning-500', labelClass: 'text-warning-700' },
  { key: 'good', width: '75%', barClass: 'bg-brand-500', labelClass: 'text-emphasis' },
  { key: 'strong', width: '100%', barClass: 'bg-success-500', labelClass: 'text-success-700' },
] as const;

export function PasswordStrengthMeter({ password }: Props) {
  const { t } = useTranslation();
  if (!password) return null;

  const level = LEVEL_BY_SCORE[getScore(password)];

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
