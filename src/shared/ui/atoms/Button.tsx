import { ActivityIndicator, Pressable, Text } from 'react-native';
import { palette } from '@shared/theme/tokens';

/**
 * Primitive de botón (token-driven, NativeWind). No conoce el dominio.
 * TODO: respaldar internamente con gluestack-ui v3 cuando se inicialice
 * (`npx gluestack-ui init`); la API pública no debería cambiar.
 */
export type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  isLoading?: boolean;
  disabled?: boolean;
}

const containerByVariant: Record<ButtonVariant, string> = {
  primary: 'bg-brand-500 active:bg-brand-600',
  secondary: 'bg-brand-50 active:bg-brand-100',
};

const labelByVariant: Record<ButtonVariant, string> = {
  primary: 'text-white',
  secondary: 'text-brand-700',
};

const spinnerColorByVariant: Record<ButtonVariant, string> = {
  primary: palette.neutral[0],
  secondary: palette.brand[700],
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={isDisabled}
      className={`min-h-[48px] w-full flex-row items-center justify-center rounded-button px-6 py-3.5 ${containerByVariant[variant]} ${isDisabled ? 'opacity-60' : ''}`}>
      {isLoading ? (
        <ActivityIndicator color={spinnerColorByVariant[variant]} />
      ) : (
        <Text className={`text-button font-jakarta-semibold ${labelByVariant[variant]}`}>{title}</Text>
      )}
    </Pressable>
  );
}
