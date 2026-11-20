import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, SquareCheckBig } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { Avatar } from '@shared/ui/molecules/Avatar';
import { palette, semanticColors } from '@shared/theme/tokens';
import { useAppColorScheme } from '@shared/theme/useAppColorScheme';
import { ThemeVarsProvider } from '@core/theme/ThemeVarsProvider';
import { HouseholdHeader } from '@features/household/HouseholdHeader';
import { useHouseholdMembers } from '@features/household/useHouseholdMembers';
import { useCalendar } from '@features/calendar/useCalendar';

export function CalendarScreen() {
  const { t, i18n } = useTranslation();
  const scheme = useAppColorScheme();
  const calendar = useCalendar();
  const { resolveMember } = useHouseholdMembers();
  const locale = i18n.language;
  const muted = semanticColors[scheme].textSecondary;

  const monthLabel = calendar.selected.toLocaleDateString(locale, { month: 'long' });
  const dayTitle = calendar.selected.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <ThemeVarsProvider>
      <SafeAreaView className="flex-1 bg-base" edges={['top']}>
        <HouseholdHeader />

        <View className="flex-row items-center justify-between px-4 pb-3 pt-1">
          <Text className="text-h1 font-jakarta-bold capitalize text-foreground">{monthLabel}</Text>
          <View className="flex-row items-center">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('calendar.previousWeek')}
              onPress={calendar.previousWeek}
              className="h-11 w-11 items-center justify-center">
              <ChevronLeft size={20} color={semanticColors[scheme].textPrimary} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={calendar.goToToday}
              disabled={calendar.isTodaySelected}
              className={`h-9 justify-center rounded-badge border border-line bg-surface px-3 ${
                calendar.isTodaySelected ? 'opacity-50' : ''
              }`}>
              <Text className="text-caption font-jakarta-bold text-foreground">{t('calendar.today')}</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('calendar.nextWeek')}
              onPress={calendar.nextWeek}
              className="h-11 w-11 items-center justify-center">
              <ChevronRight size={20} color={semanticColors[scheme].textPrimary} />
            </Pressable>
          </View>
        </View>

        <View accessibilityRole="tablist" className="mx-4 mb-4 flex-row gap-1">
          {calendar.week.map((day) => (
            <Pressable
              key={day.date.toISOString()}
              accessibilityRole="tab"
              accessibilityState={{ selected: day.isSelected }}
              accessibilityLabel={day.date.toLocaleDateString(locale, { weekday: 'long', day: 'numeric' })}
              onPress={() => calendar.select(day.date)}
              className={`h-[68px] flex-1 items-center justify-center gap-0.5 rounded-card ${
                day.isSelected ? 'bg-brand-700' : ''
              }`}>
              <Text
                className={`text-[11px] capitalize ${
                  day.isSelected ? 'font-jakarta-semibold text-white' : 'font-jakarta-semibold text-muted'
                }`}>
                {day.date.toLocaleDateString(locale, { weekday: 'short' }).replace('.', '')}
              </Text>
              <Text
                className={`text-h2 ${
                  day.isSelected
                    ? 'font-jakarta-bold text-white'
                    : day.isToday
                      ? 'font-jakarta-bold text-emphasis'
                      : 'font-jakarta-semibold text-foreground'
                }`}>
                {day.date.getDate()}
              </Text>
              <View
                className={`h-[5px] w-[5px] rounded-full ${
                  day.count > 0 ? (day.isSelected ? 'bg-white' : 'bg-brand-600') : 'bg-transparent'
                }`}
              />
            </Pressable>
          ))}
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32, gap: 10 }}>
          <Text accessibilityRole="header" className="text-body font-jakarta-bold capitalize text-foreground">
            {dayTitle}
          </Text>

          {calendar.isLoading ? (
            <ActivityIndicator color={palette.brand[600]} />
          ) : calendar.agenda.length === 0 ? (
            <Text className="py-6 text-center text-caption font-sans text-muted">{t('calendar.emptyDay')}</Text>
          ) : (
            calendar.agenda.map(({ task, due, hasTime }) => {
              const assignee = resolveMember(task.assignee_id);
              return (
                <View key={task.id} className="flex-row items-start gap-3">
                  <Text className="w-14 pt-3.5 text-caption font-jakarta-bold text-muted" style={{ fontVariant: ['tabular-nums'] }}>
                    {hasTime ? due.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }) : t('calendar.allDay')}
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => calendar.openTask(task)}
                    className="flex-1 flex-row items-center gap-2.5 rounded-card border border-line bg-surface p-3 active:opacity-80">
                    <SquareCheckBig size={18} color={muted} />
                    <View className="flex-1">
                      <Text
                        className={`text-body font-jakarta-semibold ${task.status === 'completed' ? 'text-muted line-through' : 'text-foreground'}`}
                        numberOfLines={2}>
                        {task.title}
                      </Text>
                      <Text className="text-caption font-sans text-muted">
                        {assignee ? t('calendar.taskOf', { name: assignee.name }) : t('tasks.unassigned')}
                      </Text>
                    </View>
                    {assignee ? (
                      <Avatar name={assignee.name} size={26} color={assignee.color} textColor={assignee.textColor} bordered={false} />
                    ) : null}
                  </Pressable>
                </View>
              );
            })
          )}

          <Text className="pt-2 text-center text-caption font-sans text-muted">{t('calendar.tasksHint')}</Text>
        </ScrollView>
      </SafeAreaView>
    </ThemeVarsProvider>
  );
}
