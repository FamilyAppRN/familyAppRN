import { Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@shared/ui/atoms/Button';
import { palette } from '@shared/theme/tokens';
import { useWelcome } from '@features/auth/welcome/useWelcome';

export function WelcomeScreen() {
  const { t } = useTranslation();
  const { goToLogin, goToRegister } = useWelcome();

  return (
    <SafeAreaView className="flex-1 bg-brand-50">
      <View className="flex-1 justify-between px-4 py-6">
        {/* Header: logo + nombre */}
        <View className="items-center mt-2">
          <View className="mb-3 h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-card">
             <Heart size={28} color={palette.brand[700]} strokeWidth={2.5} />
          </View>
          <Text className="text-h2 font-jakarta-semibold text-foreground">{t('welcome.brand')}</Text>
        </View>

        {/* Hero + copy */}
        <View className="flex-1 items-center justify-center py-2">
          <View className="mb-6 flex-shrink overflow-hidden aspect-[3/4] w-full max-w-[220px] max-h-[280px] items-center justify-center rounded-[24px] border-4 border-surface bg-white shadow-sm">
             <Image 
                source={require('@/assets/welcome_hero_family.png')} 
                style={{ width: '100%', height: '100%', resizeMode: 'cover' }} 
             />
          </View>

          <View className="items-center px-2">
            <Text className="mb-3 text-center text-display font-jakarta-bold text-foreground">
              {t('welcome.title')}
            </Text>
            <Text className="max-w-[280px] text-center text-body font-sans text-muted">
              {t('welcome.subtitle')}
            </Text>
          </View>
        </View>

        {/* Footer: CTAs */}
        <View className="gap-3 pb-2">
          <Button title={t('welcome.login')} variant="primary" onPress={goToLogin} />
          <Button title={t('welcome.register')} variant="secondary" onPress={goToRegister} />
        </View>
      </View>
    </SafeAreaView>
  );
}
