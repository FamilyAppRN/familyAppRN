import { Text, View } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@shared/ui/atoms/Button';
import { palette } from '@shared/theme/tokens';
import { useWelcome } from '@features/auth/welcome/useWelcome';

export function WelcomeScreen() {
  const { t } = useTranslation();
  const { goToLogin, goToRegister } = useWelcome();

  return (
    <SafeAreaView className="flex-1 bg-base">
      <View className="flex-1 px-6 py-4">
        {/* Centro: logo + marca + imagen + copy */}
        <View className="flex-1 items-center justify-center">
          {/* Ícono real de la app (Gestia) */}
          <View className="mb-3 h-16 w-16 overflow-hidden rounded-[20px] border border-line shadow-card">
            <Image
              source={require('@/assets/images/Gestia_Icon.png')}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
          </View>
          <Text className="mb-6 text-h2 font-jakarta-bold text-foreground">{t('welcome.brand')}</Text>

          {/* Imagen de la familia */}
          <View className="mb-7 aspect-[4/3] w-full max-w-[300px] overflow-hidden rounded-[24px] border border-line bg-surface shadow-card">
            <Image
              source={require('@/assets/welcome_hero_family.png')}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
          </View>

          <Text className="mb-3 px-2 text-center text-display font-jakarta-bold text-foreground">
            {t('welcome.title')}
          </Text>
          <Text className="max-w-[300px] text-center text-body font-sans text-muted">
            {t('welcome.subtitle')}
          </Text>
        </View>

        {/* Footer: CTAs */}
        <View className="gap-3 pb-2">
          <Button
            title={t('welcome.login')}
            variant="primary"
            onPress={goToLogin}
            rightIcon={<ArrowRight size={20} color={palette.neutral[0]} />}
          />
          <Button title={t('welcome.register')} variant="secondary" onPress={goToRegister} />
        </View>
      </View>
    </SafeAreaView>
  );
}
