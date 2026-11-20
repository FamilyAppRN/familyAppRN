import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Info, Trophy } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { BackButton } from '@shared/ui/atoms/BackButton';
import { EmptyState } from '@shared/ui/molecules/EmptyState';
import { palette } from '@shared/theme/tokens';
import { ThemeVarsProvider } from '@core/theme/ThemeVarsProvider';
import type { PointsPeriod } from '@features/tasks/domain/points';
import { usePoints } from '@features/tasks/points/usePoints';

const PERIODS: PointsPeriod[] = ['week', 'total'];

// Sombra de la pestaña elegida como style estático (ver TasksScreen).
const selectedTabShadow = {
  shadowColor: '#171510',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.08,
  shadowRadius: 3,
  elevation: 1,
};

/** Medalla de la posición: oro para el primero, gris para el segundo. */
const POSITION_STYLE: Record<number, { bg: string; text: string }> = {
  1: { bg: 'bg-warning-500', text: 'text-neutral-950' },
  2: { bg: 'bg-line', text: 'text-foreground' },
};
const DEFAULT_POSITION = { bg: 'bg-surface-2', text: 'text-muted' };

export function PointsScreen() {
  const { t } = useTranslation();
  const p = usePoints();
  const periodLabel = t(`points.period.${p.period}`);

  return (
    <ThemeVarsProvider>
      <SafeAreaView className="flex-1 bg-base" edges={['top', 'bottom']}>
        <View className="flex-row items-center gap-1 px-4 pb-2 pt-2">
          <BackButton onPress={p.goBack} />
          <View className="flex-1">
            <Text accessibilityRole="header" className="text-h2 font-jakarta-bold text-foreground">
              {t('points.title')}
            </Text>
            <Text className="text-caption font-sans text-muted">{p.householdName}</Text>
          </View>
        </View>

        {!p.isPremium && !p.isLoading ? (
          <EmptyState
            Icon={Trophy}
            tone="green"
            title={t('points.premium.title')}
            description={t('points.premium.description')}
            cta={{ label: t('points.premium.cta'), onPress: p.openPremium }}
          />
        ) : (
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32, gap: 16 }}
            refreshControl={
              <RefreshControl refreshing={p.isRefreshing} onRefresh={p.refresh} tintColor={palette.brand[600]} />
            }>
            <View accessibilityRole="tablist" className="flex-row gap-1 rounded-button bg-surface-2 p-1">
              {PERIODS.map((key) => {
                const selected = p.period === key;
                return (
                  <Pressable
                    key={key}
                    accessibilityRole="tab"
                    accessibilityState={{ selected }}
                    onPress={() => p.setPeriod(key)}
                    style={selected ? selectedTabShadow : undefined}
                    className={`h-[38px] flex-1 items-center justify-center rounded-[9px] ${selected ? 'bg-surface' : ''}`}>
                    <Text
                      className={`text-caption ${
                        selected ? 'font-jakarta-bold text-foreground' : 'font-jakarta-semibold text-muted'
                      }`}>
                      {t(`points.period.${key}`)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {p.isLoading ? (
              <ActivityIndicator color={palette.brand[600]} />
            ) : p.isError ? (
              <Text className="pt-6 text-center text-caption font-sans text-muted">{t('points.loadError')}</Text>
            ) : (
              <>
                {p.me ? (
                  <View className="flex-row items-center gap-3.5 rounded-card border border-line bg-surface p-4">
                    <View
                      className="h-12 w-12 items-center justify-center rounded-full"
                      style={{ backgroundColor: p.me.color }}>
                      <Text className="text-body font-jakarta-bold" style={{ color: p.me.textColor }}>
                        {p.me.initials}
                      </Text>
                    </View>
                    <View className="flex-1 gap-0.5">
                      <Text className="text-caption font-sans text-muted">
                        {t(p.period === 'week' ? 'points.mine.week' : 'points.mine.total')}
                      </Text>
                      <Text
                        className="text-[28px] font-jakarta-bold leading-8 text-foreground"
                        style={{ fontVariant: ['tabular-nums'] }}>
                        {p.myPoints}
                      </Text>
                      {!p.isKid ? (
                        <Text className="text-caption font-sans text-muted">{t('points.mine.adultNote')}</Text>
                      ) : null}
                    </View>
                  </View>
                ) : null}

                {p.pending.map((task) => (
                  <View key={task.id} className="flex-row items-center gap-3 rounded-card bg-warning-100 px-3.5 py-3">
                    <Pressable accessibilityRole="button" onPress={() => p.openTask(task)} className="flex-1 gap-0.5">
                      <Text className="text-body font-jakarta-bold text-neutral-950">{task.title}</Text>
                      <Text className="text-caption font-sans text-neutral-800">
                        {t('points.pending', {
                          name: p.memberById(task.assignee_id)?.name ?? t('points.someone'),
                          count: task.points ?? 0,
                        })}
                      </Text>
                    </Pressable>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={t('tasks.verify.approveLabel', { title: task.title })}
                      disabled={p.verifyingId === task.id}
                      onPress={() => p.verify(task)}
                      className="h-[38px] items-center justify-center rounded-[10px] bg-brand-600 px-3.5 active:opacity-90">
                      {p.verifyingId === task.id ? (
                        <ActivityIndicator color={palette.neutral[0]} />
                      ) : (
                        <Text className="text-caption font-jakarta-bold text-white">{t('tasks.verify.short')}</Text>
                      )}
                    </Pressable>
                  </View>
                ))}

                <View className="gap-2">
                  <View className="flex-row items-baseline justify-between">
                    <Text accessibilityRole="header" className="text-body font-jakarta-bold text-foreground">
                      {t('points.table.title')}
                    </Text>
                    <Text className="text-caption font-sans text-muted">{t(`points.table.since.${p.period}`)}</Text>
                  </View>

                  {p.ranking.length === 0 ? (
                    <View className="rounded-card border border-line bg-surface p-4">
                      <Text className="text-caption font-sans text-muted">{t('points.table.noKids')}</Text>
                    </View>
                  ) : (
                    <View className="overflow-hidden rounded-card border border-line bg-surface">
                      {p.ranking.map(({ member, points, position }, index) => {
                        const medal = POSITION_STYLE[position] ?? DEFAULT_POSITION;
                        const isMe = member.id === p.me?.id;
                        const width = p.topPoints > 0 ? `${Math.round((points / p.topPoints) * 100)}%` : '0%';
                        return (
                          <View
                            key={member.id}
                            accessibilityLabel={t('points.table.rowLabel', { position, name: member.name, count: points })}
                            className={`flex-row items-center gap-3 px-3.5 py-3 ${
                              index < p.ranking.length - 1 ? 'border-b border-line' : ''
                            } ${isMe ? 'bg-chip' : ''}`}>
                            <View className={`h-7 w-7 items-center justify-center rounded-full ${medal.bg}`}>
                              <Text className={`text-caption font-jakarta-bold ${medal.text}`}>{position}</Text>
                            </View>
                            <View
                              className="h-9 w-9 items-center justify-center rounded-full"
                              style={{ backgroundColor: member.color }}>
                              <Text className="font-jakarta-bold" style={{ color: member.textColor }}>
                                {member.initials}
                              </Text>
                            </View>
                            <View className="min-w-0 flex-1 gap-1.5">
                              <Text numberOfLines={1} className="text-body font-jakarta-semibold text-foreground">
                                {isMe ? t('household.members.you', { name: member.name }) : member.name}
                              </Text>
                              <View className="h-1.5 overflow-hidden rounded-full bg-surface-2">
                                <View
                                  className={`h-full rounded-full ${position === 1 ? 'bg-brand-600' : 'bg-brand-300'}`}
                                  style={{ width: width as `${number}%` }}
                                />
                              </View>
                            </View>
                            <Text
                              className="text-[17px] font-jakarta-bold text-foreground"
                              style={{ fontVariant: ['tabular-nums'] }}>
                              {points}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </View>

                {p.earned.length > 0 ? (
                  <View className="gap-2">
                    <Text accessibilityRole="header" className="text-body font-jakarta-bold text-foreground">
                      {t('points.earned.title', { period: periodLabel.toLowerCase() })}
                    </Text>
                    <View className="overflow-hidden rounded-card border border-line bg-surface">
                      {p.earned.map((task, index) => (
                        <Pressable
                          key={task.id}
                          accessibilityRole="button"
                          onPress={() => p.openTask(task)}
                          className={`flex-row items-center gap-3 px-3.5 py-3 active:opacity-80 ${
                            index < p.earned.length - 1 ? 'border-b border-line' : ''
                          }`}>
                          <View className="min-w-0 flex-1">
                            <Text numberOfLines={1} className="text-body font-jakarta-semibold text-foreground">
                              {task.title}
                            </Text>
                            {!p.isKid ? (
                              <Text className="text-caption font-sans text-muted">
                                {p.memberById(task.assignee_id)?.name ?? t('points.someone')}
                              </Text>
                            ) : null}
                          </View>
                          <Text className="text-caption font-jakarta-bold text-emphasis">
                            {t('points.earned.plus', { count: task.points ?? 0 })}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                ) : null}

                <View className="flex-row items-center gap-2.5 rounded-[14px] bg-surface-2 px-3.5 py-3">
                  <Info size={18} color={palette.neutral[600]} />
                  <Text className="flex-1 text-caption font-sans text-muted">
                    {t(p.period === 'week' ? 'points.note.week' : 'points.note.total')}
                  </Text>
                </View>
              </>
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    </ThemeVarsProvider>
  );
}
