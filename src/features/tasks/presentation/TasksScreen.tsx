import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ListChecks } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { EmptyState } from '@shared/ui/molecules/EmptyState';
import { ScreenHeader } from '@shared/ui/molecules/ScreenHeader';
import { palette } from '@shared/theme/tokens';
import { useTasks } from '@features/tasks/presentation/useTasks';

export function TasksScreen() {
  const { t } = useTranslation();
  const { householdName, tasks, isLoading, isError } = useTasks();

  return (
    <SafeAreaView className="flex-1 bg-base" edges={['top']}>
      <ScreenHeader title={householdName ?? ''} />

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={palette.brand[500]} />
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center px-10">
          <Text className="text-center text-caption font-sans text-muted">
            {t('tasks.loadError')}
          </Text>
        </View>
      ) : tasks.length === 0 ? (
        <EmptyState
          Icon={ListChecks}
          tone="green"
          title={t('tasks.empty.title')}
          description={t('tasks.empty.description')}
          cta={{ label: t('tasks.empty.cta'), onPress: () => {} }}
        />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
          {tasks.map((task) => (
            <View key={task.id} className="rounded-card border border-line bg-surface p-4">
              <Text className="text-body font-jakarta-semibold text-foreground">{task.title}</Text>
              {task.description ? (
                <Text className="mt-1 text-caption font-sans text-muted" numberOfLines={1}>
                  {task.description}
                </Text>
              ) : null}
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
