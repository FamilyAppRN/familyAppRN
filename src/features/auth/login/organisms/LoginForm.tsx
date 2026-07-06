import { Pressable, Text, View } from 'react-native';
import { Controller, type Control } from 'react-hook-form';
import { ArrowRight, Lock, Mail } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { TextField } from '@shared/ui/molecules/TextField';
import { Button } from '@shared/ui/atoms/Button';
import { palette } from '@shared/theme/tokens';
import type { LoginFormData } from '@features/auth/login/loginFormSchema';
import { AppleIcon, GoogleIcon } from '@features/auth/login/organisms/SocialIcons';

interface Props {
  control: Control<LoginFormData>;
  onSubmit: () => void;
  isPending: boolean;
  isValid: boolean;
  errorMessage?: string;
  onForgot: () => void;
  onGoogle: () => void;
  onApple: () => void;
}

export function LoginForm({
  control,
  onSubmit,
  isPending,
  isValid,
  errorMessage,
  onForgot,
  onGoogle,
  onApple,
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
        <Pressable onPress={onForgot} className="mt-1 self-end" hitSlop={8}>
          <Text className="text-caption font-jakarta-semibold text-emphasis">
            {t('login.forgot')}
          </Text>
        </Pressable>
      </View>

      {errorMessage ? (
        <Text className="text-caption font-sans text-danger-500">{errorMessage}</Text>
      ) : null}

      <Button
        title={t('login.submit')}
        onPress={onSubmit}
        isLoading={isPending}
        disabled={!isValid}
        rightIcon={<ArrowRight size={20} color={palette.neutral[0]} />}
      />

      {/* Divider */}
      <View className="my-2 flex-row items-center">
        <View className="h-px flex-1 bg-line" />
        <Text className="px-3 text-caption font-sans text-muted">{t('login.divider')}</Text>
        <View className="h-px flex-1 bg-line" />
      </View>

      {/* Social login */}
      <View className="gap-3">
        <Pressable
          accessibilityRole="button"
          onPress={onGoogle}
          className="h-12 w-full flex-row items-center justify-center gap-3 rounded-button border border-line bg-surface-2 active:opacity-90">
          <GoogleIcon />
          <Text className="text-button font-jakarta-semibold text-foreground">Google</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={onApple}
          className="h-12 w-full flex-row items-center justify-center gap-3 rounded-button bg-neutral-800 active:opacity-90">
          <AppleIcon color={palette.neutral[0]} />
          <Text className="text-button font-jakarta-semibold text-white">Apple</Text>
        </Pressable>
      </View>
    </View>
  );
}
