import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  AtSign,
  Camera,
  HelpCircle,
  LogOut,
  Music2,
  Share2,
  SlidersHorizontal,
  Users,
  Award,
} from 'lucide-react-native';

import { Avatar } from '@shared/ui/molecules/Avatar';
import { ProfileRow } from '@shared/ui/molecules/ProfileRow';
import { ThemeSelector } from '@shared/ui/molecules/ThemeSelector';
import { palette, semanticColors } from '@shared/theme/tokens';
import { useAppColorScheme } from '@shared/theme/useAppColorScheme';
import { ThemeVarsProvider } from '@core/theme/ThemeVarsProvider';
import { useAuthStore } from '@features/auth/store/useAuthStore';
import { logout } from '@features/auth/logout';

// Redes sociales: sin URLs reales todavía — no-op hasta que se definan.
const SOCIAL_ICONS = [Camera, AtSign, Music2];

export function ProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const scheme = useAppColorScheme();
  const user = useAuthStore((s) => s.user);

  const isPremium = user?.plan === 'premium';

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/welcome');
  };

  return (
    <ThemeVarsProvider>
      <SafeAreaView className="flex-1 bg-base" edges={['top']}>
        <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 32 }}>
          {/* Cabecera: avatar + nombre + plan */}
          <View className="items-center">
            <Avatar name={user?.name ?? '?'} onEditPress={() => {}} />
            <Text className="mt-3 text-h2 font-jakarta-bold text-foreground">{user?.name}</Text>
            <View
              className={`mt-1.5 flex-row items-center gap-1 rounded-badge px-2.5 py-1 ${
                isPremium ? 'bg-chip' : 'bg-surface-2'
              }`}>
              <Award
                size={12}
                color={isPremium ? semanticColors[scheme].emphasis : palette.neutral[400]}
              />
              <Text
                className={`text-[11px] font-jakarta-bold ${
                  isPremium ? 'text-emphasis' : 'text-muted'
                }`}>
                {t(isPremium ? 'profile.plan.premium' : 'profile.plan.free')}
              </Text>
            </View>
          </View>

          {/* Lista de opciones */}
          <View className="mt-5">
            <ProfileRow
              Icon={Users}
              title={t('profile.members.title')}
              subtitle={t('profile.members.subtitle')}
              onPress={() => {}}
            />
            <ProfileRow
              Icon={Award}
              title={t('profile.subscription.title')}
              subtitle={t('profile.subscription.subtitle')}
              onPress={() => {}}
            />

            {/* Tema: fila propia (sin chevron), selector debajo */}
            <View className="gap-3 border-b border-line py-3.5">
              <View className="flex-row items-center gap-3">
                <SlidersHorizontal size={20} color={semanticColors[scheme].emphasis} />
                <View className="flex-1">
                  <Text className="text-body font-jakarta-semibold text-foreground">
                    {t('profile.theme.title')}
                  </Text>
                  <Text className="mt-0.5 text-caption font-sans text-muted">
                    {t('profile.theme.subtitle')}
                  </Text>
                </View>
              </View>
              <ThemeSelector />
            </View>

            <ProfileRow
              Icon={HelpCircle}
              title={t('profile.support.title')}
              subtitle={t('profile.support.subtitle')}
              onPress={() => {}}
            />

            <ProfileRow
              Icon={Share2}
              title={t('profile.social.title')}
              subtitle={t('profile.social.subtitle')}
              noBorder
              trailing={
                <View className="flex-row gap-2">
                  {SOCIAL_ICONS.map((SocialIcon, i) => (
                    <View
                      key={i}
                      className="h-8 w-8 items-center justify-center rounded-full bg-surface-2">
                      <SocialIcon size={16} color={semanticColors[scheme].textSecondary} />
                    </View>
                  ))}
                </View>
              }
            />
          </View>

          {/* Cerrar sesión */}
          <Pressable
            accessibilityRole="button"
            onPress={handleLogout}
            className="mt-5 h-12 flex-row items-center justify-center gap-1.5 rounded-button bg-danger-soft active:opacity-80">
            <LogOut size={18} color={palette.danger[500]} />
            <Text className="text-button font-jakarta-bold text-danger-500">
              {t('home.logout')}
            </Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </ThemeVarsProvider>
  );
}
