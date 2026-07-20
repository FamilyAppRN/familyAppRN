import { Pressable, Text, View } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';

import { semanticColors } from '@shared/theme/tokens';
import { useAppColorScheme } from '@shared/theme/useAppColorScheme';

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

/** Stepper numérico  −  n  +  (genérico, no conoce el dominio). */
export function QuantityStepper({ value, onChange, min = 1, max = 999 }: QuantityStepperProps) {
  const scheme = useAppColorScheme();
  const canDecrease = value > min;
  const canIncrease = value < max;

  return (
    <View className="h-[46px] flex-row items-center justify-between rounded-input border border-line bg-base px-3">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Restar"
        disabled={!canDecrease}
        hitSlop={8}
        onPress={() => onChange(value - 1)}>
        <Minus
          size={18}
          color={canDecrease ? semanticColors[scheme].textSecondary : semanticColors[scheme].textFaint}
        />
      </Pressable>

      <Text className="text-body font-jakarta-bold text-foreground">{value}</Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Sumar"
        disabled={!canIncrease}
        hitSlop={8}
        onPress={() => onChange(value + 1)}>
        <Plus
          size={18}
          color={canIncrease ? semanticColors[scheme].emphasis : semanticColors[scheme].textFaint}
        />
      </Pressable>
    </View>
  );
}
