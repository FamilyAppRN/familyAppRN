import { Pressable, Text, View } from 'react-native';
import { Controller, type Control } from 'react-hook-form';
import { Lock, Mail } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { TextField } from '@shared/ui/molecules/TextField';
import { Button } from '@shared/ui/atoms/Button';
import { palette } from '@shared/theme/tokens';
import type { LoginFormData } from '@features/auth/login/loginFormSchema';

interface Props {
  control: Control<LoginFormData>;
  onSubmit: () => void;
  isPending: boolean;
  isValid: boolean;
  errorMessage?: string;
  onForgot: () => void;
}

export function LoginForm({
  control,
  onSubmit,
  isPending,
  isValid,
  errorMessage,
  onForgot,
}: Props) {
  const { t } = useTranslation();

  return (
    <View className="gap-4">
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <TextField
            label={t('login.emailLabel')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={error?.message ? t(error.message) : undefined}
            placeholder={t('login.emailPlaceholder')}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            leftIcon={<Mail size={20} color={palette.neutral[400]} />}
          />
        )}
      />

      <View>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <TextField
              label={t('login.passwordLabel')}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={error?.message ? t(error.message) : undefined}
              placeholder={t('login.passwordPlaceholder')}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
              leftIcon={<Lock size={20} color={palette.neutral[400]} />}
            />
          )}
        />
        <Pressable accessibilityRole="link" onPress={onForgot} className="mt-1 min-h-[44px] justify-center self-end" hitSlop={8}>
          <Text className="text-caption font-jakarta-semibold text-emphasis">
            {t('login.forgot')}
          </Text>
        </Pressable>
      </View>

      {errorMessage ? (
        <Text accessibilityRole="alert" className="text-caption font-sans text-danger-700">{errorMessage}</Text>
      ) : null}

      <Button
        title={t('login.submit')}
        onPress={onSubmit}
        isLoading={isPending}
        disabled={!isValid}
      />

    </View>
  );
}
