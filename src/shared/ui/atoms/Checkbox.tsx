import { Pressable } from 'react-native';
import { Check } from 'lucide-react-native';
import { palette } from '@shared/theme/tokens';

interface CheckboxProps {
  checked: boolean;
  onChange: (value: boolean) => void;
}

export function Checkbox({ checked, onChange }: CheckboxProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      hitSlop={8}
      onPress={() => onChange(!checked)}
      className={`h-5 w-5 items-center justify-center rounded border ${
        checked ? 'border-brand-500 bg-brand-500' : 'border-line bg-surface'
      }`}>
      {checked ? <Check size={14} color={palette.neutral[0]} strokeWidth={3} /> : null}
    </Pressable>
  );
}
