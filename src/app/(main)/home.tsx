import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Button } from '@shared/ui/atoms/Button';
import { useAuthStore } from '@features/auth/store/useAuthStore';

// Placeholder post-login. Se reemplaza por la Lista de Compras (Etapa 2).
export default function HomeRoute() {
  const { t } = useTranslation();
  const router = useRouter();
  const clearUser = useAuthStore((s) => s.clearUser);

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-base px-4">
      <Text className="text-h1 font-jakarta-bold text-foreground">{t('home.title')}</Text>
      <Text className="mb-6 mt-2 text-center text-body font-sans text-muted">
        {t('home.subtitle')}
      </Text>
      <View className="w-full max-w-[280px]">
        <Button
          title={t('home.logout')}
          variant="secondary"
          onPress={() => {
            clearUser();
            router.replace('/(auth)/welcome');
          }}
        />
      </View>
    </SafeAreaView>
  );
}
