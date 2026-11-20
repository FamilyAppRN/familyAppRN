import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { House, UserPlus } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { useHouseholdOnboarding } from '@features/household/onboarding/useHouseholdOnboarding';
import { InviteCodeInput } from '@features/household/onboarding/organisms/InviteCodeInput';
import { TextField } from '@shared/ui/molecules/TextField';
import { Button } from '@shared/ui/atoms/Button';
import { BackButton } from '@shared/ui/atoms/BackButton';
import { palette, semanticColors } from '@shared/theme/tokens';
import { useAppColorScheme } from '@shared/theme/useAppColorScheme';
import { ThemeVarsProvider } from '@core/theme/ThemeVarsProvider';

/**
 * Primer paso tras crear la cuenta. "Me invitaron" va primero y destacado:
 * es el camino de casi todos los miembros, salvo quien crea el hogar.
 */
export function HouseholdOnboardingScreen() {
  const { t } = useTranslation();
  const scheme = useAppColorScheme();
  const onboarding = useHouseholdOnboarding();

  return (
    <ThemeVarsProvider>
      <SafeAreaView className="flex-1 bg-base">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 32, paddingBottom: 24, gap: 24 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {onboarding.canGoBack ? (
              <View className="-mb-2 -ml-2.5">
                <BackButton onPress={onboarding.goBack} />
              </View>
            ) : null}
            <View className="gap-2">
              {onboarding.firstName ? (
                <Text className="text-caption font-jakarta-semibold text-emphasis">
                  {t('householdOnboarding.greeting', { name: onboarding.firstName })}
                </Text>
              ) : null}
              <Text accessibilityRole="header" className="text-h1 font-jakarta-bold text-foreground">
                {t('householdOnboarding.title')}
              </Text>
              <Text className="text-body font-sans text-muted">{t('householdOnboarding.subtitle')}</Text>
            </View>

            {/* Me invitaron */}
            <View className="gap-3.5 rounded-[20px] border-[1.5px] border-brand-600 bg-surface p-5">
              <View className="flex-row items-center gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-button bg-chip">
                  <UserPlus size={20} color={semanticColors[scheme].emphasis} />
                </View>
                <View className="flex-1">
                  <Text className="text-h2 font-jakarta-bold text-foreground">
                    {t('householdOnboarding.joinCardTitle')}
                  </Text>
                  <Text className="text-caption font-sans text-muted">{t('householdOnboarding.joinCardDesc')}</Text>
                </View>
              </View>

              <InviteCodeInput
                value={onboarding.inviteCode}
                onChange={onboarding.setInviteCode}
                onComplete={(code) => onboarding.onJoinHousehold(code)}
              />

              {onboarding.isJoining ? (
                <ActivityIndicator color={palette.brand[600]} />
              ) : onboarding.joinError ? (
                <Text accessibilityRole="alert" className="text-caption font-sans text-danger-700">
                  {onboarding.joinError}
                </Text>
              ) : (
                <Text className="text-caption font-sans text-muted">{t('householdOnboarding.joinHint')}</Text>
              )}
            </View>

            <View className="flex-row items-center gap-3">
              <View className="h-px flex-1 bg-line" />
              <Text className="text-caption font-sans text-muted">{t('householdOnboarding.or')}</Text>
              <View className="h-px flex-1 bg-line" />
            </View>

            {/* Crear mi hogar */}
            <View className="gap-3.5 rounded-[20px] border border-line bg-surface p-5">
              <View className="flex-row items-center gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-button bg-accent-soft">
                  <House size={20} color={scheme === 'dark' ? palette.accent[400] : palette.accent[600]} />
                </View>
                <View className="flex-1">
                  <Text className="text-h2 font-jakarta-bold text-foreground">
                    {t('householdOnboarding.createCardTitle')}
                  </Text>
                  <Text className="text-caption font-sans text-muted">{t('householdOnboarding.createCardDesc')}</Text>
                </View>
              </View>

              <TextField
                label={t('householdOnboarding.createLabel')}
                value={onboarding.householdName}
                onChangeText={onboarding.setHouseholdName}
                placeholder={t('householdOnboarding.createPlaceholder')}
                autoCapitalize="words"
                error={onboarding.createError}
              />

              <Button
                title={t('householdOnboarding.createBtnSubmit')}
                variant="secondary"
                onPress={onboarding.onCreateHousehold}
                isLoading={onboarding.isCreating}
                disabled={!onboarding.canCreate}
              />
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={onboarding.onLogout}
              className="mt-auto min-h-[44px] items-center justify-center self-center"
              hitSlop={8}>
              <Text className="text-caption font-jakarta-semibold text-muted">{t('home.logout')}</Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemeVarsProvider>
  );
}
