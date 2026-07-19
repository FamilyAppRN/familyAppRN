import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight, HousePlus, UserPlus } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

import { logout } from '@features/auth/logout';
import { useHouseholdOnboarding } from '@features/household/onboarding/useHouseholdOnboarding';
import { InviteCodeInput } from '@features/household/onboarding/organisms/InviteCodeInput';
import { TextField } from '@shared/ui/molecules/TextField';
import { Button } from '@shared/ui/atoms/Button';
import { palette, semanticColors } from '@shared/theme/tokens';
import { useAppColorScheme } from '@shared/theme/useAppColorScheme';
import { ThemeVarsProvider } from '@core/theme/ThemeVarsProvider';

export function HouseholdOnboardingScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const scheme = useAppColorScheme();
  const {
    householdName,
    setHouseholdName,
    inviteCode,
    setInviteCode,
    showCreateInput,
    onCreateHousehold,
    isCreating,
    createError,
    onJoinHousehold,
    isJoining,
    joinError,
  } = useHouseholdOnboarding();

  const createIconColor = semanticColors[scheme].emphasis;
  const joinIconColor = scheme === 'dark' ? palette.accent[400] : palette.accent[600];

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/welcome');
  };

  return (
    <ThemeVarsProvider>
      <SafeAreaView className="flex-1 bg-base">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1">
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <View className="px-6 pt-4">
              {/* Logo */}
              <View className="items-center">
                <View className="mb-4 h-16 w-16 overflow-hidden rounded-[20px] border border-line shadow-card">
                  <Image
                    source={require('@/assets/images/Gestia_Icon.png')}
                    style={{ width: '100%', height: '100%' }}
                    contentFit="cover"
                  />
                </View>
                <Text className="text-center text-h1 font-jakarta-bold text-foreground">
                  {t('householdOnboarding.title')}
                </Text>
                <Text className="mt-2 max-w-[320px] text-center text-body font-sans text-muted">
                  {t('householdOnboarding.subtitle')}
                </Text>
              </View>

              {/* Card: Crear mi hogar */}
              <View className="mt-7 rounded-[20px] border border-line bg-surface p-5 shadow-card">
                <View className="flex-row items-center gap-3">
                  <View className="h-11 w-11 items-center justify-center rounded-[14px] bg-chip">
                    <HousePlus size={22} color={createIconColor} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-body font-jakarta-bold text-foreground">
                      {t('householdOnboarding.createCardTitle')}
                    </Text>
                    <Text className="mt-0.5 text-caption font-sans text-muted">
                      {t('householdOnboarding.createCardDesc')}
                    </Text>
                  </View>
                </View>

                {showCreateInput ? (
                  <View className="mt-4">
                    <TextField
                      value={householdName}
                      onChangeText={setHouseholdName}
                      placeholder={t('householdOnboarding.createPlaceholder')}
                      autoCapitalize="words"
                      error={createError}
                    />
                  </View>
                ) : null}

                <View className="mt-4">
                  <Button
                    title={
                      showCreateInput
                        ? t('householdOnboarding.createBtnSubmit')
                        : t('householdOnboarding.createBtnStart')
                    }
                    variant="primary"
                    onPress={onCreateHousehold}
                    isLoading={isCreating}
                    rightIcon={<ArrowRight size={18} color={palette.neutral[0]} />}
                  />
                </View>
              </View>

              {/* Divider */}
              <View className="my-4 flex-row items-center gap-3">
                <View className="h-px flex-1 bg-line" />
                <Text className="text-caption font-sans text-faint">
                  {t('householdOnboarding.or')}
                </Text>
                <View className="h-px flex-1 bg-line" />
              </View>

              {/* Card: Unirme a un hogar */}
              <View className="rounded-[20px] border border-line bg-surface p-5 shadow-card">
                <View className="flex-row items-center gap-3">
                  <View className="h-11 w-11 items-center justify-center rounded-[14px] bg-accent-soft">
                    <UserPlus size={22} color={joinIconColor} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-body font-jakarta-bold text-foreground">
                      {t('householdOnboarding.joinCardTitle')}
                    </Text>
                    <Text className="mt-0.5 text-caption font-sans text-muted">
                      {t('householdOnboarding.joinCardDesc')}
                    </Text>
                  </View>
                </View>

                <InviteCodeInput
                  value={inviteCode}
                  onChange={setInviteCode}
                  onComplete={(code) => onJoinHousehold(code)}
                />

                {isJoining ? (
                  <ActivityIndicator className="mt-1" color={palette.brand[500]} />
                ) : joinError ? (
                  <Text className="mt-1 text-center text-caption font-sans text-danger-500">
                    {joinError}
                  </Text>
                ) : null}
              </View>

              {/* Cerrar sesión (salida sutil) */}
              <Pressable onPress={handleLogout} className="mt-6 self-center" hitSlop={8}>
                <Text className="text-caption font-jakarta-semibold text-muted">
                  {t('home.logout')}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemeVarsProvider>
  );
}
