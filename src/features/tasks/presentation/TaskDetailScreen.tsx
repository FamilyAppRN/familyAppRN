import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { Check } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { BackButton } from '@shared/ui/atoms/BackButton';
import { Button } from '@shared/ui/atoms/Button';
import { palette } from '@shared/theme/tokens';
import { ThemeVarsProvider } from '@core/theme/ThemeVarsProvider';
import { useTaskDetail } from '@features/tasks/presentation/useTaskDetail';
import { formatDue } from '@features/tasks/presentation/formatDue';
import type { ResolvedMember } from '@features/household/useHouseholdMembers';

function MemberValue({ member, fallback }: { member: ResolvedMember | null; fallback: string }) {
  if (!member) return <Text className="text-body font-jakarta-semibold text-muted">{fallback}</Text>;
  return (
    <View className="flex-row items-center gap-2">
      <View className="h-7 w-7 items-center justify-center rounded-full" style={{ backgroundColor: member.color }}>
        <Text className="text-caption font-jakarta-bold text-white">{member.initials}</Text>
      </View>
      <Text className="text-body font-jakarta-semibold text-foreground">{member.name}</Text>
    </View>
  );
}

function Row({ label, children, last = false }: { label: string; children: React.ReactNode; last?: boolean }) {
  return (
    <View className={`flex-row items-center gap-3 px-4 py-3 ${last ? '' : 'border-b border-line'}`}>
      <Text className="w-28 text-caption font-sans text-muted">{label}</Text>
      <View className="flex-1">{children}</View>
    </View>
  );
}

export function TaskDetailScreen() {
  const { t, i18n } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const detail = useTaskDetail(id);
  const { task } = detail;

  return (
    <ThemeVarsProvider>
      <SafeAreaView className="flex-1 bg-base" edges={['top', 'bottom']}>
        <View className="flex-row items-center justify-between px-6 pb-2 pt-2">
          <BackButton onPress={detail.goBack} />
          {task ? (
            <Pressable
              accessibilityRole="button"
              onPress={detail.edit}
              className="h-10 justify-center rounded-button border border-line bg-surface px-4 active:opacity-80">
              <Text className="text-caption font-jakarta-bold text-foreground">{t('tasks.detail.edit')}</Text>
            </Pressable>
          ) : null}
        </View>

        {detail.isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color={palette.brand[600]} />
          </View>
        ) : !task ? (
          <View className="flex-1 items-center justify-center px-10">
            <Text className="text-center text-caption font-sans text-muted">{t('tasks.detail.notFound')}</Text>
          </View>
        ) : (
          <>
            <ScrollView contentContainerStyle={{ padding: 24, gap: 20 }}>
              <View className="gap-2">
                <View className={`self-start rounded-badge px-3 py-1 ${detail.done ? 'bg-chip' : 'bg-surface-2'}`}>
                  <Text className={`text-caption font-jakarta-bold ${detail.done ? 'text-emphasis' : 'text-muted'}`}>
                    {t(detail.done ? 'tasks.detail.status.done' : 'tasks.detail.status.pending')}
                  </Text>
                </View>
                <Text className="text-h1 font-jakarta-bold text-foreground">{task.title}</Text>
                {task.description ? (
                  <Text className="text-body font-sans text-foreground">{task.description}</Text>
                ) : null}
              </View>

              <View className="rounded-card border border-line bg-surface">
                <Row label={t('tasks.detail.assignedTo')}>
                  <MemberValue member={detail.assignee} fallback={t('tasks.unassigned')} />
                </Row>
                <Row label={t('tasks.detail.when')}>
                  <Text className="text-body font-jakarta-semibold text-foreground">
                    {detail.dueDate ? formatDue(detail.dueDate, t, i18n.language) : t('tasks.form.noDate')}
                  </Text>
                </Row>
                <Row label={t('tasks.detail.createdBy')} last>
                  <MemberValue member={detail.creator} fallback="—" />
                </Row>
              </View>
            </ScrollView>

            <View className="gap-2 px-6 pb-4">
              {detail.confirmingDelete ? (
                <View accessibilityRole="alert" className="gap-3 rounded-card border border-line bg-surface p-4 shadow-modal">
                  <Text className="text-h2 font-jakarta-bold text-foreground">{t('tasks.detail.confirmTitle')}</Text>
                  <Text className="text-caption font-sans text-muted">{t('tasks.detail.confirmBody')}</Text>
                  <View className="flex-row gap-2">
                    <Pressable
                      accessibilityRole="button"
                      onPress={detail.cancelDelete}
                      className="h-12 flex-1 items-center justify-center rounded-button border border-line bg-surface active:opacity-80">
                      <Text className="text-button font-jakarta-bold text-foreground">{t('tasks.detail.cancel')}</Text>
                    </Pressable>
                    <Pressable
                      accessibilityRole="button"
                      onPress={detail.confirmDelete}
                      disabled={detail.isDeleting}
                      className="h-12 flex-1 items-center justify-center rounded-button bg-danger-700 active:opacity-90">
                      {detail.isDeleting ? (
                        <ActivityIndicator color={palette.neutral[0]} />
                      ) : (
                        <Text className="text-button font-jakarta-bold text-white">{t('tasks.detail.confirm')}</Text>
                      )}
                    </Pressable>
                  </View>
                </View>
              ) : (
                <>
                  <Button
                    title={t(detail.done ? 'tasks.detail.reopen' : 'tasks.detail.markDone')}
                    onPress={detail.toggleDone}
                    isLoading={detail.isTogglingDone}
                    variant={detail.done ? 'secondary' : 'primary'}
                    rightIcon={detail.done ? undefined : <Check size={18} color={palette.neutral[0]} />}
                  />
                  <Pressable
                    accessibilityRole="button"
                    onPress={detail.askDelete}
                    className="h-12 items-center justify-center active:opacity-70">
                    <Text className="text-button font-jakarta-bold text-danger-700">{t('tasks.detail.delete')}</Text>
                  </Pressable>
                </>
              )}
            </View>
          </>
        )}
      </SafeAreaView>
    </ThemeVarsProvider>
  );
}
