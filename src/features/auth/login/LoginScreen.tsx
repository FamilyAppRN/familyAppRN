import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { LoginForm } from '@features/auth/login/organisms/LoginForm';
import { useLogin } from '@features/auth/login/useLogin';
import { EmailDivider, SocialAuthButtons } from '@features/auth/shared/SocialAuthButtons';
import { BackButton } from '@shared/ui/atoms/BackButton';
import { ThemeVarsProvider } from '@core/theme/ThemeVarsProvider';

export function LoginScreen() {
  const { t } = useTranslation();
  const {
    control,
    onSubmit,
    isPending,
    isValid,
    errorMessage,
    goBack,
    goToRegister,
    goToForgot,
    onGoogle,
    onApple,
  } = useLogin();

  return (
    <ThemeVarsProvider>
      <SafeAreaView className="flex-1 bg-base">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 8, paddingBottom: 24, gap: 24 }}
            keyboardShouldPersistTaps="handled">
            <View className="-ml-2.5">
              <BackButton onPress={goBack} />
            </View>

            <View className="gap-2">
              <Text accessibilityRole="header" className="text-h1 font-jakarta-bold text-foreground">
                {t('login.title')}
              </Text>
              <Text className="text-body font-sans text-muted">{t('login.subtitle')}</Text>
            </View>

            <SocialAuthButtons onGoogle={onGoogle} onApple={onApple} />
            <EmailDivider />

            <LoginForm
              control={control}
              onSubmit={onSubmit}
              isPending={isPending}
              isValid={isValid}
              errorMessage={errorMessage}
              onForgot={goToForgot}
            />

            <View className="mt-auto flex-row items-center justify-center">
              <Text className="text-caption font-sans text-muted">{t('login.noAccount')}</Text>
              <Pressable accessibilityRole="link" onPress={goToRegister} hitSlop={12} className="min-h-[44px] justify-center">
                <Text className="text-caption font-jakarta-bold text-emphasis">{t('login.createFamily')}</Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemeVarsProvider>
  );
}
