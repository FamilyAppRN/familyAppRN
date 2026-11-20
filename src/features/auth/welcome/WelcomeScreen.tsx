import type { ComponentType } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ListChecks, ShoppingCart, Users } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@shared/ui/atoms/Button';
import { palette, semanticColors } from '@shared/theme/tokens';
import { useAppColorScheme } from '@shared/theme/useAppColorScheme';
import { ThemeVarsProvider } from '@core/theme/ThemeVarsProvider';
import { useWelcome } from '@features/auth/welcome/useWelcome';

type BenefitKey = 'shopping' | 'tasks' | 'homes';

const BENEFITS: { key: BenefitKey; Icon: ComponentType<{ size?: number; color?: string }>; tile: string }[] = [
  { key: 'shopping', Icon: ShoppingCart, tile: 'bg-chip' },
  { key: 'tasks', Icon: ListChecks, tile: 'bg-accent-soft' },
  { key: 'homes', Icon: Users, tile: 'bg-surface-2' },
];

export function WelcomeScreen() {
  const { t } = useTranslation();
  const scheme = useAppColorScheme();
  const { goToLogin, goToRegister } = useWelcome();

  const iconColor: Record<BenefitKey, string> = {
    shopping: semanticColors[scheme].emphasis,
    tasks: scheme === 'dark' ? palette.accent[400] : palette.accent[600],
    homes: semanticColors[scheme].textPrimary,
  };

  return (
    <ThemeVarsProvider>
      <SafeAreaView className="flex-1 bg-base">
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 32, paddingBottom: 16, gap: 32 }}>
          <View className="flex-row items-center gap-2.5">
            <View className="h-11 w-11 overflow-hidden rounded-[14px] border border-line">
              <Image
                source={require('@/assets/images/Gestia_Icon.png')}
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
                accessibilityIgnoresInvertColors
              />
            </View>
            <Text className="text-h2 font-jakarta-bold text-foreground">{t('welcome.brand')}</Text>
          </View>

          <View className="gap-3">
            <Text accessibilityRole="header" className="text-display font-jakarta-bold text-foreground">
              {t('welcome.title')}
            </Text>
            <Text className="text-body font-sans text-muted">{t('welcome.subtitle')}</Text>
          </View>

          <View className="flex-1 gap-2.5">
            {BENEFITS.map(({ key, Icon, tile }) => (
              <View key={key} className="flex-row items-center gap-3.5 rounded-card border border-line bg-surface p-3.5">
                <View className={`h-10 w-10 items-center justify-center rounded-button ${tile}`}>
                  <Icon size={20} color={iconColor[key]} />
                </View>
                <View className="flex-1 gap-0.5">
                  <Text className="text-body font-jakarta-bold text-foreground">{t(`welcome.benefits.${key}.title`)}</Text>
                  <Text className="text-caption font-sans text-muted">{t(`welcome.benefits.${key}.description`)}</Text>
                </View>
              </View>
            ))}
          </View>

          <View className="gap-2.5">
            <Button title={t('welcome.register')} variant="primary" onPress={goToRegister} />
            <Button title={t('welcome.login')} variant="secondary" onPress={goToLogin} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemeVarsProvider>
  );
}
