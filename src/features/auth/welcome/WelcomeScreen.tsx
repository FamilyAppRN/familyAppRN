import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight, House } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@shared/ui/atoms/Button';
import { LanguageSwitch } from '@shared/ui/atoms/LanguageSwitch';
import { palette } from '@shared/theme/tokens';
import { useWelcome } from '@features/auth/welcome/useWelcome';

// Tile del logo: degradado de marca (nativo, sin dep extra). Cuando exista el
// PNG del logo de Gestia, se reemplaza el ícono <House/> por <Image/>.
const logoGradient = {
  experimental_backgroundImage: 'linear-gradient(145deg, #4F9E6B, #2E6240)',
} as const;

export function WelcomeScreen() {
  const { t } = useTranslation();
  const { goToLogin, goToRegister } = useWelcome();

  return (
    <SafeAreaView className="flex-1 bg-base">
      <View className="flex-1 px-6 py-4">
        {/* Top: selector de idioma (sin ajustes) */}
        <View className="flex-row justify-end">
          <LanguageSwitch />
        </View>

        {/* Centro: logo + marca + imagen + copy */}
        <View className="flex-1 items-center justify-center">
          <View
            className="mb-3 h-16 w-16 items-center justify-center rounded-[20px] shadow-card"
            style={logoGradient as object}>
            <House size={30} color={palette.neutral[0]} strokeWidth={2.5} />
          </View>
          <Text className="mb-6 text-h2 font-jakarta-bold text-foreground">{t('welcome.brand')}</Text>

          {/* Imagen de la familia (activo existente) */}
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
        <View className="gap-4 pb-2">
          <Button
            title={t('welcome.login')}
            variant="primary"
            onPress={goToLogin}
            rightIcon={<ArrowRight size={20} color={palette.neutral[0]} />}
          />
          <Pressable onPress={goToRegister} className="items-center py-1" hitSlop={8}>
            <Text className="text-body font-jakarta-semibold text-emphasis">
              {t('welcome.register')}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
