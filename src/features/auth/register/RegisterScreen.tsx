import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { House } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { RegisterForm } from '@features/auth/register/organisms/RegisterForm';
import { useRegister } from '@features/auth/register/useRegister';
import { LanguageSwitch } from '@shared/ui/atoms/LanguageSwitch';
import { palette } from '@shared/theme/tokens';

export function RegisterScreen() {
  const { t } = useTranslation();
  const { control, onSubmit, isPending, errorMessage, goToLogin } = useRegister();

  return (
    <SafeAreaView className="flex-1 bg-base">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled">
        <View className="px-4 py-8">
          <View className="mb-2 flex-row justify-end">
            <LanguageSwitch />
          </View>

          <View className="rounded-card border border-line bg-surface p-5 shadow-card">
            {/* Header */}
            <View className="mb-6 items-center">
              <View className="mb-3 h-16 w-16 items-center justify-center rounded-full bg-brand-50">
                <House size={30} color={palette.brand[700]} strokeWidth={2} />
              </View>
              <Text className="text-h1 font-jakarta-bold text-foreground">{t('register.title')}</Text>
              <Text className="mt-1 text-center text-body font-sans text-muted">
                {t('register.subtitle')}
              </Text>
            </View>

            <RegisterForm
              control={control}
              onSubmit={onSubmit}
              isPending={isPending}
              errorMessage={errorMessage}
            />

            <View className="mt-6 flex-row justify-center">
              <Text className="text-caption font-sans text-muted">{t('register.haveAccount')}</Text>
              <Pressable onPress={goToLogin} hitSlop={8}>
                <Text className="text-caption font-jakarta-semibold text-brand-600">
                  {t('register.login')}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
