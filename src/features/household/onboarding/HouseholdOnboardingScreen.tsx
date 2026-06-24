import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
  Image,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogOut, Home, Users, Plus, ArrowRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

import { useAuthStore } from '@features/auth/store/useAuthStore';
import { useHouseholdOnboarding } from '@features/household/onboarding/useHouseholdOnboarding';
import { InviteCodeInput } from '@features/household/onboarding/organisms/InviteCodeInput';
import { TextField } from '@shared/ui/molecules/TextField';
import { Button } from '@shared/ui/atoms/Button';
import { palette } from '@shared/theme/tokens';

export function HouseholdOnboardingScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const clearUser = useAuthStore((s) => s.clearUser);
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

  const handleLogout = () => {
    clearUser();
    router.replace('/(auth)/welcome');
  };

  return (
    <SafeAreaView className="flex-1 bg-brand-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Bar */}
          <View className="flex-row justify-between items-center px-4 py-3">
            <View />
            <Pressable
              onPress={handleLogout}
              className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 active:bg-white border border-brand-100/50"
              hitSlop={8}
            >
              <LogOut size={16} color={palette.brand[700]} />
              <Text className="text-caption font-jakarta-semibold text-brand-700">
                {t('home.logout')}
              </Text>
            </Pressable>
          </View>

          {/* Title & Subtitle */}
          <View className="items-center px-6 mt-2">
            <Text className="text-h1 font-jakarta-bold text-foreground text-center">
              {t('householdOnboarding.title')}
            </Text>
            <Text className="text-body font-sans text-muted text-center mt-2 max-w-[320px]">
              {t('householdOnboarding.subtitle')}
            </Text>
          </View>

          {/* Hero Image Container */}
          <View className="items-center justify-center py-6">
            <View className="h-36 w-36 items-center justify-center rounded-3xl border-4 border-white bg-white/40 shadow-sm overflow-hidden">
              <Image
                source={require('@/assets/household_onboarding_hero.png')}
                style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
              />
            </View>
          </View>

          {/* Cards Section */}
          <View className="px-4 gap-5">
            {/* Card 1: Create Household */}
            <View className="bg-white rounded-3xl p-6 shadow-card border border-brand-100/30">
              <View className="flex-row items-center gap-3 mb-2">
                <View className="h-10 w-10 items-center justify-center rounded-xl bg-brand-50">
                  <Home size={20} color={palette.brand[600]} />
                </View>
                <Text className="text-h3 font-jakarta-semibold text-foreground">
                  {t('householdOnboarding.createCardTitle')}
                </Text>
              </View>
              
              <Text className="text-caption font-sans text-muted mb-4">
                {t('householdOnboarding.createCardDesc')}
              </Text>

              {showCreateInput && (
                <View className="mb-4">
                  <TextField
                    value={householdName}
                    onChangeText={setHouseholdName}
                    placeholder={t('householdOnboarding.createPlaceholder')}
                    autoCapitalize="words"
                    error={createError}
                  />
                </View>
              )}

              <Button
                title={showCreateInput ? t('householdOnboarding.createBtnSubmit') : t('householdOnboarding.createBtnStart')}
                variant="primary"
                onPress={onCreateHousehold}
                isLoading={isCreating}
                rightIcon={!showCreateInput ? <Plus size={18} color="#fff" /> : undefined}
              />
            </View>

            {/* Card 2: Join Household */}
            <View className="bg-white rounded-3xl p-6 shadow-card border border-brand-100/30">
              <View className="flex-row items-center gap-3 mb-2">
                <View className="h-10 w-10 items-center justify-center rounded-xl bg-brand-50">
                  <Users size={20} color={palette.brand[600]} />
                </View>
                <Text className="text-h3 font-jakarta-semibold text-foreground">
                  {t('householdOnboarding.joinCardTitle')}
                </Text>
              </View>

              <Text className="text-caption font-sans text-muted mb-4">
                {t('householdOnboarding.joinCardDesc')}
              </Text>

              <InviteCodeInput
                value={inviteCode}
                onChange={setInviteCode}
              />

              {joinError ? (
                <Text className="text-caption font-sans text-danger-500 text-center mb-3 mt-1">
                  {joinError}
                </Text>
              ) : null}

              <Button
                title={t('householdOnboarding.joinBtnSubmit')}
                variant="secondary"
                onPress={onJoinHousehold}
                isLoading={isJoining}
                disabled={inviteCode.length < 6}
                rightIcon={<ArrowRight size={18} color={palette.brand[700]} />}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
