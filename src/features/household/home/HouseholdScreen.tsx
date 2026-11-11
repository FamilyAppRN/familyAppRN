import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogOut, Mail, Pencil, RefreshCw, Share2 } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { Avatar } from '@shared/ui/molecules/Avatar';
import { TextField } from '@shared/ui/molecules/TextField';
import { palette, semanticColors } from '@shared/theme/tokens';
import { useAppColorScheme } from '@shared/theme/useAppColorScheme';
import { ThemeVarsProvider } from '@core/theme/ThemeVarsProvider';
import { HouseholdHeader } from '@features/household/HouseholdHeader';
import { useHouseholdHome } from '@features/household/home/useHouseholdHome';

export function HouseholdScreen() {
  const { t } = useTranslation();
  const scheme = useAppColorScheme();
  const home = useHouseholdHome();

  const confirmKind = home.confirm?.kind;
  const confirmTitle =
    home.confirm?.kind === 'remove'
      ? t('household.confirm.removeTitle', { name: home.confirm.member.name })
      : confirmKind === 'regenerate'
        ? t('household.confirm.regenerateTitle')
        : t('household.confirm.leaveTitle', { household: home.householdName });
  const confirmBody =
    confirmKind === 'remove'
      ? t('household.confirm.removeBody')
      : confirmKind === 'regenerate'
        ? t('household.confirm.regenerateBody')
        : t('household.confirm.leaveBody');
  const confirmLabel =
    confirmKind === 'remove'
      ? t('household.confirm.remove')
      : confirmKind === 'regenerate'
        ? t('household.confirm.regenerate')
        : t('household.confirm.leave');

  return (
    <ThemeVarsProvider>
      <SafeAreaView className="flex-1 bg-base" edges={['top']}>
        <HouseholdHeader />

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 4, paddingBottom: home.confirm ? 220 : 32, gap: 16 }}
            keyboardShouldPersistTaps="handled">
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
                <View className="flex-row gap-2">
                  <Pressable
                    accessibilityRole="button"
                    onPress={home.shareInvite}
                    className="h-12 flex-1 flex-row items-center justify-center gap-2 rounded-button bg-white active:opacity-90">
                    <Share2 size={16} color={palette.brand[700]} />
                    <Text className="text-button font-jakarta-bold text-brand-700">{t('household.invite.share')}</Text>
                  </Pressable>
                  {home.isAdmin ? (
                    <Pressable
                      accessibilityRole="button"
                      onPress={home.startEmailInvite}
                      className="h-12 flex-1 flex-row items-center justify-center gap-2 rounded-button border border-white/40 active:opacity-80">
                      <Mail size={16} color={palette.neutral[0]} />
                      <Text className="text-button font-jakarta-bold text-white">{t('household.invite.byEmail')}</Text>
                    </Pressable>
                  ) : null}
                </View>

                {home.inviteEmail !== null ? (
                  <View className="gap-2 rounded-card bg-white p-3">
                    <TextField
                      label={t('household.invite.emailLabel')}
                      value={home.inviteEmail}
                      onChangeText={home.setInviteEmail}
                      placeholder={t('household.invite.emailPlaceholder')}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      error={home.emailError ? t('household.invite.emailError') : undefined}
                    />
                    <View className="flex-row gap-2">
                      <Pressable
                        accessibilityRole="button"
                        onPress={home.cancelEmailInvite}
                        className="h-11 flex-1 items-center justify-center rounded-button border border-neutral-200 active:opacity-80">
                        <Text className="text-caption font-jakarta-bold text-neutral-950">{t('household.settings.cancel')}</Text>
                      </Pressable>
                      <Pressable
                        accessibilityRole="button"
                        onPress={home.sendEmailInvite}
                        disabled={!home.canSendEmail}
                        className={`h-11 flex-1 items-center justify-center rounded-button bg-brand-600 ${
                          home.canSendEmail ? 'active:opacity-90' : 'opacity-50'
                        }`}>
                        {home.isSendingEmail ? (
                          <ActivityIndicator color={palette.neutral[0]} />
                        ) : (
                          <Text className="text-caption font-jakarta-bold text-white">{t('household.invite.send')}</Text>
                        )}
                      </Pressable>
                    </View>
                  </View>
                ) : home.invitedEmail ? (
                  <Text accessibilityLiveRegion="polite" className="text-caption font-jakarta-semibold text-white">
                    {t('household.invite.sent', { email: home.invitedEmail })}
                  </Text>
                ) : null}

                {home.isAdmin ? (
                  <Pressable
                    accessibilityRole="button"
                    onPress={home.askRegenerate}
                    className="min-h-[44px] flex-row items-center justify-center gap-1.5 active:opacity-70">
                    <RefreshCw size={14} color={palette.brand[100]} />
                    <Text className="text-caption font-jakarta-semibold text-brand-100">{t('household.invite.regenerate')}</Text>
                  </Pressable>
                ) : null}
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
                        <Avatar name={member.name} size={38} color={member.color} textColor={member.textColor} bordered={false} />
                        <View className="flex-1">
                          <Text className="text-body font-jakarta-semibold text-foreground" numberOfLines={1}>
                            {isMe ? t('household.members.you', { name: member.name }) : member.name}
                          </Text>
                          {member.id === home.ownerId ? (
                            <Text className="text-caption font-sans text-muted">{t('household.members.owner')}</Text>
                          ) : null}
                        </View>
                        <View className={`rounded-badge px-2.5 py-1 ${isAdmin ? 'bg-chip' : 'bg-surface-2'}`}>
                          <Text className={`text-caption font-jakarta-bold ${isAdmin ? 'text-emphasis' : 'text-muted'}`}>
                            {t(isAdmin ? 'household.members.admin' : 'household.members.member')}
                          </Text>
                        </View>
                        {home.canRemove(member) ? (
                          <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={t('household.members.removeLabel', { name: member.name })}
                            onPress={() => home.askRemove(member)}
                            className="h-11 justify-center pl-1">
                            <Text className="text-caption font-jakarta-bold text-danger-700">{t('household.members.remove')}</Text>
                          </Pressable>
                        ) : null}
                      </View>
                    );
                  })}
                </View>
              )}
            </View>

            <View className="gap-2">
              <Text accessibilityRole="header" className="text-body font-jakarta-bold text-foreground">
                {t('household.settings.title')}
              </Text>
              <View className="overflow-hidden rounded-card border border-line bg-surface">
                {home.isAdmin ? (
                  home.editingName !== null ? (
                    <View className="gap-3 border-b border-line p-3.5">
                      <TextField
                        label={t('household.settings.nameLabel')}
                        value={home.editingName}
                        onChangeText={home.setEditingName}
                        autoCapitalize="words"
                        error={home.renameError ? t('household.settings.renameError') : undefined}
                      />
                      <View className="flex-row gap-2">
                        <Pressable
                          accessibilityRole="button"
                          onPress={home.cancelRename}
                          className="h-11 flex-1 items-center justify-center rounded-button border border-line bg-surface active:opacity-80">
                          <Text className="text-caption font-jakarta-bold text-foreground">{t('household.settings.cancel')}</Text>
                        </Pressable>
                        <Pressable
                          accessibilityRole="button"
                          onPress={home.saveName}
                          disabled={!home.canSaveName}
                          className={`h-11 flex-1 items-center justify-center rounded-button bg-brand-600 ${
                            home.canSaveName ? 'active:opacity-90' : 'opacity-50'
                          }`}>
                          {home.isRenaming ? (
                            <ActivityIndicator color={palette.neutral[0]} />
                          ) : (
                            <Text className="text-caption font-jakarta-bold text-white">{t('household.settings.save')}</Text>
                          )}
                        </Pressable>
                      </View>
                    </View>
                  ) : (
                    <Pressable
                      accessibilityRole="button"
                      onPress={home.startRename}
                      className="min-h-[56px] flex-row items-center gap-3 border-b border-line px-3.5 py-2.5 active:opacity-70">
                      <Pencil size={18} color={semanticColors[scheme].textPrimary} />
                      <View className="flex-1">
                        <Text className="text-body font-jakarta-semibold text-foreground">{t('household.settings.nameLabel')}</Text>
                        <Text className="text-caption font-sans text-muted" numberOfLines={1}>
                          {home.householdName}
                        </Text>
                      </View>
                      <Text className="text-caption font-jakarta-bold text-emphasis">{t('household.settings.change')}</Text>
                    </Pressable>
                  )
                ) : null}

                {home.isOwner ? (
                  <View className="min-h-[56px] flex-row items-center gap-3 px-3.5 py-3">
                    <LogOut size={18} color={semanticColors[scheme].textFaint} />
                    <Text className="flex-1 text-caption font-sans text-muted">{t('household.settings.ownerCannotLeave')}</Text>
                  </View>
                ) : (
                  <Pressable
                    accessibilityRole="button"
                    onPress={home.askLeave}
                    className="min-h-[56px] flex-row items-center gap-3 px-3.5 py-2.5 active:opacity-70">
                    <LogOut size={18} color={palette.danger[700]} />
                    <Text className="text-body font-jakarta-semibold text-danger-700">{t('household.settings.leave')}</Text>
                  </Pressable>
                )}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {home.confirm ? (
          <View
            accessibilityRole="alert"
            className="absolute bottom-4 left-4 right-4 gap-3 rounded-card border border-line bg-surface p-4 shadow-modal">
            <Text className="text-h2 font-jakarta-bold text-foreground">{confirmTitle}</Text>
            <Text className="text-caption font-sans text-muted">{confirmBody}</Text>
            {home.confirmError ? (
              <Text className="text-caption font-sans text-danger-700">{t('household.confirm.error')}</Text>
            ) : null}
            <View className="flex-row gap-2">
              <Pressable
                accessibilityRole="button"
                onPress={home.cancelConfirm}
                className="h-12 flex-1 items-center justify-center rounded-button border border-line bg-surface active:opacity-80">
                <Text className="text-button font-jakarta-bold text-foreground">{t('household.confirm.cancel')}</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={home.confirmAction}
                disabled={home.isConfirming}
                className={`h-12 flex-1 items-center justify-center rounded-button active:opacity-90 ${
                  confirmKind === 'regenerate' ? 'bg-brand-600' : 'bg-danger-700'
                }`}>
                {home.isConfirming ? (
                  <ActivityIndicator color={palette.neutral[0]} />
                ) : (
                  <Text className="text-button font-jakarta-bold text-white">{confirmLabel}</Text>
                )}
              </Pressable>
            </View>
          </View>
        ) : null}
      </SafeAreaView>
    </ThemeVarsProvider>
  );
}
