import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { House } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { LoginForm } from '@features/auth/login/organisms/LoginForm';
import { useLogin } from '@features/auth/login/useLogin';
import { LanguageSwitch } from '@shared/ui/atoms/LanguageSwitch';
import { palette } from '@shared/theme/tokens';

export function LoginScreen() {
  const { t } = useTranslation();
  const { control, onSubmit, isPending, errorMessage, goToRegister, goToForgot, onGoogle, onApple } =
    useLogin();

  return (
    <SafeAreaView className="flex-1 bg-brand-50">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled">
        <View className="px-4 py-8">
          <View className="mb-2 flex-row justify-end">
            <LanguageSwitch />
          </View>

          {/* Logo */}
          <View className="mb-6 items-center">
            <View className="mb-2 h-16 w-16 items-center justify-center rounded-full bg-brand-50">
              <House size={30} color={palette.brand[700]} strokeWidth={2} />
            </View>
            <Text className="text-h1 font-jakarta-bold text-brand-900">{t('login.brand')}</Text>
          </View>

          {/* Card */}
          <View className="rounded-card border border-line bg-surface p-5 shadow-card">
            <View className="mb-6 items-center">
              <Text className="text-h1 font-jakarta-bold text-foreground">{t('login.title')}</Text>
              <Text className="mt-1 text-body font-sans text-muted">{t('login.subtitle')}</Text>
            </View>

            <LoginForm
              control={control}
              onSubmit={onSubmit}
              isPending={isPending}
              errorMessage={errorMessage}
              onForgot={goToForgot}
              onGoogle={onGoogle}
              onApple={onApple}
            />

            <View className="mt-6 flex-row justify-center">
              <Text className="text-caption font-sans text-muted">{t('login.noAccount')}</Text>
              <Pressable onPress={goToRegister} hitSlop={8}>
                <Text className="text-caption font-jakarta-semibold text-brand-600">
                  {t('login.createFamily')}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
