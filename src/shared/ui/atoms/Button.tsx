import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { palette } from '@shared/theme/tokens';

/**
 * Primitive de botón (token-driven, NativeWind). No conoce el dominio.
 * TODO: respaldar internamente con gluestack-ui v3 cuando se inicialice.
 */
export type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  isLoading?: boolean;
  disabled?: boolean;
  rightIcon?: ReactNode;
}

const containerByVariant: Record<ButtonVariant, string> = {
  primary: 'bg-brand-500 active:bg-brand-600',
  // verde suave visible en claro y oscuro (chip = #DCEFE2 / #212E20)
  secondary: 'bg-chip border border-brand-500/40 active:opacity-80',
};

const labelByVariant: Record<ButtonVariant, string> = {
  primary: 'text-white',
  secondary: 'text-emphasis',
};

const spinnerColorByVariant: Record<ButtonVariant, string> = {
  primary: palette.neutral[0],
  secondary: palette.brand[500],
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  rightIcon,
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
        <View className="flex-row items-center justify-center gap-2">
          <Text className={`text-button font-jakarta-semibold ${labelByVariant[variant]}`}>{title}</Text>
          {rightIcon}
        </View>
      )}
    </Pressable>
  );
}
