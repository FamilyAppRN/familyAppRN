import { Pressable, ScrollView, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { LoginForm } from '@features/auth/login/organisms/LoginForm';
import { useLogin } from '@features/auth/login/useLogin';
import { BackButton } from '@shared/ui/atoms/BackButton';

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
    <SafeAreaView className="flex-1 bg-base">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start' }}
        keyboardShouldPersistTaps="handled">
        <View className="px-4 pb-8 pt-2">
          <View className="mb-2">
            <BackButton onPress={goBack} />
          </View>

          {/* Logo (fuera de la card) */}
          <View className="mb-5 items-center">
            <View className="mb-3 h-16 w-16 overflow-hidden rounded-[20px] border border-line shadow-card">
              <Image
                source={require('@/assets/images/Gestia_Icon.png')}
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
              />
            </View>
            <Text className="text-h2 font-jakarta-bold text-foreground">{t('login.brand')}</Text>
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
              isValid={isValid}
              errorMessage={errorMessage}
              onForgot={goToForgot}
              onGoogle={onGoogle}
              onApple={onApple}
            />

            <View className="mt-6 flex-row justify-center">
              <Text className="text-caption font-sans text-muted">{t('login.noAccount')}</Text>
              <Pressable onPress={goToRegister} hitSlop={8}>
                <Text className="text-caption font-jakarta-semibold text-emphasis">
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
