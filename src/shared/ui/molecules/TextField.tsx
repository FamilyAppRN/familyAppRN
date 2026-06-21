import { useState, type ReactNode } from 'react';
import {
  Pressable,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type TextInputProps,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { palette } from '@shared/theme/tokens';

interface TextFieldProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  leftIcon?: ReactNode;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoComplete?: TextInputProps['autoComplete'];
}

export function TextField({
  label,
  value,
  onChangeText,
  onBlur,
  placeholder,
  error,
  leftIcon,
  secureTextEntry = false,
  keyboardType,
  autoCapitalize,
  autoComplete,
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(secureTextEntry);

  const borderClass = error
    ? 'border-danger-500'
    : focused
      ? 'border-brand-500'
      : 'border-line';

  return (
    <View className="gap-1">
      {label ? <Text className="ml-2 text-caption font-sans text-muted">{label}</Text> : null}

      <View className={`flex-row items-center rounded-input border bg-surface px-3 ${borderClass}`}>
        {leftIcon ? <View className="mr-2">{leftIcon}</View> : null}

        <TextInput
          className="flex-1 py-3 text-body font-sans text-foreground"
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            onBlur?.();
          }}
          placeholder={placeholder}
          placeholderTextColor={palette.neutral[400]}
          secureTextEntry={hidden}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
        />

        {secureTextEntry ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Mostrar contraseña' : 'Ocultar contraseña'}
            hitSlop={8}
            onPress={() => setHidden((h) => !h)}
            className="ml-2">
            {hidden ? (
              <EyeOff size={20} color={palette.neutral[400]} />
            ) : (
              <Eye size={20} color={palette.neutral[400]} />
            )}
          </Pressable>
        ) : null}
      </View>

      {error ? <Text className="ml-2 text-caption font-sans text-danger-500">{error}</Text> : null}
    </View>
  );
}
