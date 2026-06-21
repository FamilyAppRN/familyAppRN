import { Text, View } from 'react-native';
import { Controller, type Control } from 'react-hook-form';
import { Lock, Mail, User } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { TextField } from '@shared/ui/molecules/TextField';
import { Checkbox } from '@shared/ui/atoms/Checkbox';
import { Button } from '@shared/ui/atoms/Button';
import { palette } from '@shared/theme/tokens';
import type { RegisterFormData } from '@features/auth/register/registerFormSchema';

interface Props {
  control: Control<RegisterFormData>;
  onSubmit: () => void;
  isPending: boolean;
  errorMessage?: string;
}

export function RegisterForm({ control, onSubmit, isPending, errorMessage }: Props) {
  const { t } = useTranslation();

  return (
    <View className="gap-4">
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <TextField
            label={t('register.nameLabel')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={error?.message ? t(error.message) : undefined}
            placeholder={t('register.namePlaceholder')}
            autoCapitalize="words"
            autoComplete="name"
            leftIcon={<User size={20} color={palette.neutral[400]} />}
          />
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <TextField
            label={t('register.emailLabel')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={error?.message ? t(error.message) : undefined}
            placeholder={t('register.emailPlaceholder')}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            leftIcon={<Mail size={20} color={palette.neutral[400]} />}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <TextField
            label={t('register.passwordLabel')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={error?.message ? t(error.message) : undefined}
            placeholder={t('register.passwordPlaceholder')}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password-new"
            leftIcon={<Lock size={20} color={palette.neutral[400]} />}
          />
        )}
      />

      <Controller
        control={control}
        name="terms"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <View className="gap-1">
            <View className="flex-row items-start gap-3">
              <View className="pt-0.5">
                <Checkbox checked={value} onChange={onChange} />
              </View>
              <Text className="flex-1 text-caption font-sans text-muted">{t('register.terms')}</Text>
            </View>
            {error?.message ? (
              <Text className="ml-8 text-caption font-sans text-danger-500">{t(error.message)}</Text>
            ) : null}
          </View>
        )}
      />

      {errorMessage ? (
        <Text className="text-caption font-sans text-danger-500">{errorMessage}</Text>
      ) : null}

      <Button title={t('register.submit')} onPress={onSubmit} isLoading={isPending} />
    </View>
  );
}
