import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { RegisterForm } from '@features/auth/register/organisms/RegisterForm';
import { useRegister } from '@features/auth/register/useRegister';
import { BackButton } from '@shared/ui/atoms/BackButton';
import { ThemeVarsProvider } from '@core/theme/ThemeVarsProvider';

export function RegisterScreen() {
  const { t } = useTranslation();
  const { control, onSubmit, isPending, isValid, errorMessage, goBack, goToLogin } = useRegister();

  return (
    <ThemeVarsProvider>
      <SafeAreaView className="flex-1 bg-base">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start' }}
          keyboardShouldPersistTaps="handled">
          <View className="px-4 pb-8 pt-2">
            <View className="mb-4">
              <BackButton onPress={goBack} />
            </View>

            <View className="rounded-card border border-line bg-surface p-5 shadow-card">
              <View className="mb-5 items-center">
                <Text className="text-h1 font-jakarta-bold text-foreground">
                  {t('register.title')}
                </Text>
                <Text className="mt-1 text-center text-body font-sans text-muted">
                  {t('register.subtitle')}
                </Text>
              </View>

              <RegisterForm
                control={control}
                onSubmit={onSubmit}
                isPending={isPending}
                isValid={isValid}
                errorMessage={errorMessage}
              />

              <View className="mt-6 flex-row justify-center">
                <Text className="text-caption font-sans text-muted">
                  {t('register.haveAccount')}
                </Text>
                <Pressable onPress={goToLogin} hitSlop={8}>
                  <Text className="text-caption font-jakarta-semibold text-emphasis">
                    {t('register.login')}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemeVarsProvider>
  );
}
