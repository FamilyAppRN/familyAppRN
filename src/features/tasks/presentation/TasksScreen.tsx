import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, type Href } from 'expo-router';
import { ListChecks, Plus } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { EmptyState } from '@shared/ui/molecules/EmptyState';
import { palette } from '@shared/theme/tokens';
import { ThemeVarsProvider } from '@core/theme/ThemeVarsProvider';
import { useHouseholdMembers } from '@features/household/useHouseholdMembers';
import { HouseholdHeader } from '@features/household/HouseholdHeader';
import type { TaskFilter } from '@features/tasks/domain/taskGroups';
import { useTasks } from '@features/tasks/presentation/useTasks';
import { TaskRow } from '@features/tasks/presentation/organisms/TaskRow';

const FILTERS: TaskFilter[] = ['mine', 'all', 'done'];

export function TasksScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { resolveMember } = useHouseholdMembers();
  const {
    filter,
    setFilter,
    counts,
    groups,
    isEmpty,
    isLoading,
    isError,
    isRefreshing,
    refresh,
    toggleDone,
  } = useTasks();

  const goToNewTask = () => router.push('/(modals)/new-task' as Href);
  const openTask = (id: string) => router.push(`/(modals)/task/${id}` as Href);

  return (
    <ThemeVarsProvider>
      <SafeAreaView className="flex-1 bg-base" edges={['top']}>
        <HouseholdHeader />

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color={palette.brand[600]} />
          </View>
        ) : isError ? (
          <View className="flex-1 items-center justify-center px-10">
            <Text className="text-center text-caption font-sans text-muted">{t('tasks.loadError')}</Text>
          </View>
        ) : isEmpty ? (
          <EmptyState
            Icon={ListChecks}
            tone="green"
            title={t('tasks.empty.title')}
            description={t('tasks.empty.description')}
            cta={{ label: t('tasks.empty.cta'), onPress: goToNewTask }}
          />
        ) : (
          <>
            <View className="px-4 pb-3">
              <Text className="mb-3 text-h1 font-jakarta-bold text-foreground">{t('tasks.title')}</Text>
              <View accessibilityRole="tablist" className="flex-row gap-1 rounded-button bg-surface-2 p-1">
                {FILTERS.map((key) => {
                  const selected = filter === key;
                  return (
                    <Pressable
                      key={key}
                      accessibilityRole="tab"
                      accessibilityState={{ selected }}
                      onPress={() => setFilter(key)}
                      className={`h-[38px] flex-1 items-center justify-center rounded-[9px] ${
                        selected ? 'bg-surface shadow-card' : ''
                      }`}>
                      <Text
                        className={`text-caption ${
                          selected ? 'font-jakarta-bold text-foreground' : 'font-jakarta-semibold text-muted'
                        }`}>
                        {key === 'done'
                          ? t('tasks.filters.done')
                          : `${t(`tasks.filters.${key}`)} · ${counts[key]}`}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <ScrollView
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120, gap: 18 }}
              refreshControl={
                <RefreshControl refreshing={isRefreshing} onRefresh={refresh} tintColor={palette.brand[600]} />
              }>
              {groups.length === 0 ? (
                <Text className="pt-10 text-center text-caption font-sans text-muted">
                  {t(`tasks.emptyFilter.${filter}`)}
                </Text>
              ) : (
                groups.map((group) => (
                  <View key={group.key} className="gap-2">
                    <Text
                      className={`text-caption font-jakarta-bold ${
                        group.key === 'overdue' ? 'text-danger-700' : 'text-muted'
                      }`}>
                      {t(`tasks.groups.${group.key}`)}
                    </Text>
                    {group.tasks.map((task) => (
                      <TaskRow
                        key={task.id}
                        task={task}
                        assignee={resolveMember(task.assignee_id)}
                        isOverdue={group.key === 'overdue'}
                        onToggle={() => toggleDone(task)}
                        onOpen={() => openTask(task.id)}
                      />
                    ))}
                  </View>
                ))
              )}
            </ScrollView>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('tasks.new')}
              onPress={goToNewTask}
              className="absolute bottom-5 right-4 h-14 w-14 items-center justify-center rounded-[18px] bg-brand-600 active:opacity-90">
              <Plus size={26} color={palette.neutral[0]} />
            </Pressable>
          </>
        )}
      </SafeAreaView>
    </ThemeVarsProvider>
  );
}
