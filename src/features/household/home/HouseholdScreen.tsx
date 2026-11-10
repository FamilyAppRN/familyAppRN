import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Share2 } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { Avatar } from '@shared/ui/molecules/Avatar';
import { palette } from '@shared/theme/tokens';
import { ThemeVarsProvider } from '@core/theme/ThemeVarsProvider';
import { HouseholdHeader } from '@features/household/HouseholdHeader';
import { useHouseholdHome } from '@features/household/home/useHouseholdHome';

export function HouseholdScreen() {
  const { t } = useTranslation();
  const home = useHouseholdHome();

  return (
    <ThemeVarsProvider>
      <SafeAreaView className="flex-1 bg-base" edges={['top']}>
        <HouseholdHeader />

        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 4, paddingBottom: 32, gap: 16 }}>
          <Text className="text-h1 font-jakarta-bold text-foreground">{t('household.title')}</Text>

          {home.inviteCode ? (
            <View className="gap-3 rounded-[20px] bg-brand-700 p-5">
              <View className="gap-1">
                <Text accessibilityRole="header" className="text-h2 font-jakarta-bold text-white">
                  {t('household.invite.title')}
                </Text>
                <Text className="text-caption font-sans text-brand-100">{t('household.invite.body')}</Text>
              </View>
              <View className="h-14 items-center justify-center rounded-card bg-white/15">
                <Text
                  accessibilityLabel={t('shopping.emptyState.codeLabel', { code: home.inviteCode.split('').join(' ') })}
                  selectable
                  className="text-h1 font-jakarta-bold tracking-[6px] text-white">
                  {home.inviteCode}
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                onPress={home.shareInvite}
                className="h-12 flex-row items-center justify-center gap-2 rounded-button bg-white active:opacity-90">
                <Share2 size={16} color={palette.brand[700]} />
                <Text className="text-button font-jakarta-bold text-brand-700">{t('household.invite.share')}</Text>
              </Pressable>
            </View>
          ) : null}

          <View className="gap-2">
            <View className="flex-row items-baseline justify-between">
              <Text accessibilityRole="header" className="text-body font-jakarta-bold text-foreground">
                {t('household.members.title')}
              </Text>
              <Text className="text-caption font-sans text-muted">
                {t('householdHeader.members', { count: home.members.length })}
              </Text>
            </View>

            {home.isLoading ? (
              <ActivityIndicator color={palette.brand[600]} />
            ) : (
              <View className="overflow-hidden rounded-card border border-line bg-surface">
                {home.members.map((member, index) => {
                  const isMe = member.id === home.userId;
                  const isAdmin = member.role === 'admin';
                  return (
                    <View
                      key={member.id}
                      className={`min-h-[60px] flex-row items-center gap-3 px-3.5 py-2.5 ${
                        index < home.members.length - 1 ? 'border-b border-line' : ''
                      }`}>
                      <Avatar
                        name={member.name}
                        size={38}
                        color={member.color}
                        textColor={member.textColor}
                        bordered={false}
                      />
                      <Text className="flex-1 text-body font-jakarta-semibold text-foreground" numberOfLines={1}>
                        {isMe ? t('household.members.you', { name: member.name }) : member.name}
                      </Text>
                      <View className={`rounded-badge px-2.5 py-1 ${isAdmin ? 'bg-chip' : 'bg-surface-2'}`}>
                        <Text className={`text-caption font-jakarta-bold ${isAdmin ? 'text-emphasis' : 'text-muted'}`}>
                          {t(isAdmin ? 'household.members.admin' : 'household.members.member')}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemeVarsProvider>
  );
}
