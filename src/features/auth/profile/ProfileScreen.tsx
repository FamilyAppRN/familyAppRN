import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Globe, LogOut, Moon } from 'lucide-react-native';

import { Avatar } from '@shared/ui/molecules/Avatar';
import { BackButton } from '@shared/ui/atoms/BackButton';
import { LanguageSwitch } from '@shared/ui/atoms/LanguageSwitch';
import { ThemeSelector } from '@shared/ui/molecules/ThemeSelector';
import { palette, semanticColors } from '@shared/theme/tokens';
import { useAppColorScheme } from '@shared/theme/useAppColorScheme';
import { ThemeVarsProvider } from '@core/theme/ThemeVarsProvider';
import { useProfile } from '@features/auth/profile/useProfile';

/**
 * Perfil (se abre desde el avatar de la cabecera). Solo muestra opciones que
 * funcionan hoy: plan, tema, idioma y cerrar sesión. Notificaciones y mejorar
 * el plan se suman cuando existan (A5 y U5).
 */
export function ProfileScreen() {
  const { t } = useTranslation();
  const scheme = useAppColorScheme();
  const profile = useProfile();
  const iconColor = semanticColors[scheme].textPrimary;

  return (
    <ThemeVarsProvider>
      <SafeAreaView className="flex-1 bg-base" edges={['top', 'bottom']}>
        <View className="flex-row items-center gap-1 px-4 pb-2 pt-2">
          <BackButton onPress={profile.goBack} />
          <Text accessibilityRole="header" className="text-h2 font-jakarta-bold text-foreground">
            {t('profile.title')}
          </Text>
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 32, gap: 20 }}>
          <View className="flex-row items-center gap-4">
            <Avatar name={profile.name || '?'} size={72} bordered={false} />
            <View className="flex-1 gap-0.5">
              <Text className="text-h2 font-jakarta-bold text-foreground" numberOfLines={1}>
                {profile.name}
              </Text>
              <Text className="text-caption font-sans text-muted" numberOfLines={1}>
                {profile.email}
              </Text>
            </View>
          </View>

          <View
            className={`flex-row items-center gap-3 rounded-card border border-line p-4 ${
              profile.isPremium ? 'bg-chip' : 'bg-accent-soft'
            }`}>
            <View className="flex-1 gap-0.5">
              <Text className="text-body font-jakarta-bold text-foreground">
                {t(profile.isPremium ? 'profile.plan.premium' : 'profile.plan.free')}
              </Text>
              <Text className="text-caption font-sans text-muted">
                {t(profile.isPremium ? 'profile.plan.premiumLimits' : 'profile.plan.freeLimits')}
              </Text>
            </View>
            {profile.isPremium ? null : (
              <Pressable
                accessibilityRole="button"
                onPress={profile.openPremium}
                className="h-10 justify-center rounded-button bg-accent-500 px-3.5 active:opacity-90">
                <Text className="text-caption font-jakarta-bold text-neutral-950">{t('profile.plan.upgrade')}</Text>
              </Pressable>
            )}
          </View>

          <View className="gap-2">
            <Text accessibilityRole="header" className="text-caption font-jakarta-bold text-muted">
              {t('profile.preferences')}
            </Text>
            <View className="overflow-hidden rounded-card border border-line bg-surface">
              <View className="gap-3 border-b border-line p-3.5">
                <View className="flex-row items-center gap-3">
                  <Moon size={20} color={iconColor} />
                  <Text className="text-body font-jakarta-semibold text-foreground">{t('profile.theme.title')}</Text>
                </View>
                <ThemeSelector />
              </View>
              <View className="min-h-[56px] flex-row items-center gap-3 px-3.5 py-2.5">
                <Globe size={20} color={iconColor} />
                <Text className="flex-1 text-body font-jakarta-semibold text-foreground">
                  {t('profile.language')}
                </Text>
                <LanguageSwitch />
              </View>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={profile.logout}
            className="min-h-[52px] flex-row items-center gap-2.5 rounded-card border border-line bg-surface px-3.5 active:opacity-80">
            <LogOut size={18} color={palette.danger[700]} />
            <Text className="text-body font-jakarta-semibold text-danger-700">{t('home.logout')}</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </ThemeVarsProvider>
  );
}
