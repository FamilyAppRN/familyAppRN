import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Check, Clock, Plus } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { palette, semanticColors } from '@shared/theme/tokens';
import { useAppColorScheme } from '@shared/theme/useAppColorScheme';
import type { Task } from '@features/tasks/data/schemas/tasksSchema';
import { dueDateOf, isDone } from '@features/tasks/domain/taskGroups';
import { formatDue } from '@features/tasks/presentation/formatDue';
import type { ResolvedMember } from '@features/household/useHouseholdMembers';

interface TaskRowProps {
  task: Task;
  assignee: ResolvedMember | null;
  isOverdue: boolean;
  onToggle: () => void;
  onOpen: () => void;
  /** Admin: botón para aprobar una tarea que marcó un niño. */
  onVerify?: () => void;
  isVerifying?: boolean;
}

export function TaskRow({ task, assignee, isOverdue, onToggle, onOpen, onVerify, isVerifying = false }: TaskRowProps) {
  const { t, i18n } = useTranslation();
  const scheme = useAppColorScheme();
  const done = isDone(task);
  const waiting = task.status === 'waiting_verification';
  const points = task.points ?? 0;
  const due = dueDateOf(task);
  const danger = palette.danger[700];

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onOpen}
      className={`flex-row items-center gap-3 rounded-card border bg-surface px-3 py-3 active:opacity-90 ${
        isOverdue ? 'border-danger-soft' : 'border-line'
      }`}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: done }}
        accessibilityLabel={t(done ? 'tasks.reopen' : 'tasks.complete', { title: task.title })}
        onPress={onToggle}
        hitSlop={8}
        className="-m-2 h-11 w-11 items-center justify-center">
        <View
          className={`h-[26px] w-[26px] items-center justify-center rounded-full border-2 ${
            done ? 'border-brand-600 bg-brand-600' : waiting ? 'border-warning-500 bg-warning-100' : isOverdue ? 'border-danger-700' : 'border-neutral-400'
          }`}>
          {done ? <Check size={16} color={palette.neutral[0]} strokeWidth={3} /> : null}
        </View>
      </Pressable>

      <View className="flex-1 gap-1">
        <Text
          className={`text-body font-jakarta-semibold ${done ? 'text-muted line-through' : 'text-foreground'}`}
          numberOfLines={2}>
          {task.title}
        </Text>
        {waiting || (points > 0 && !done) ? (
          <View className="flex-row flex-wrap items-center gap-1.5">
            {waiting ? (
              <View className="rounded-badge bg-warning-100 px-2 py-0.5">
                <Text className="text-[11px] font-jakarta-bold text-neutral-800">{t('tasks.waitingVerification')}</Text>
              </View>
            ) : null}
            {points > 0 ? (
              <View className="rounded-badge bg-warning-100 px-2 py-0.5">
                <Text className="text-[11px] font-jakarta-bold text-neutral-800">{t('tasks.form.pointsValue', { count: points })}</Text>
              </View>
            ) : null}
          </View>
        ) : null}
        {due || !assignee ? (
          <View className="flex-row items-center gap-1.5">
            {due ? (
              <>
                <Clock size={13} color={isOverdue ? danger : semanticColors[scheme].textSecondary} />
                <Text className={`text-caption ${isOverdue ? 'font-jakarta-semibold text-danger-700' : 'font-sans text-muted'}`}>
                  {formatDue(due, t, i18n.language)}
                </Text>
              </>
            ) : null}
            {!assignee && !done ? (
              <Text className="text-caption font-sans text-muted">
                {due ? '· ' : ''}
                {t('tasks.unassigned')}
              </Text>
            ) : null}
          </View>
        ) : null}
      </View>

      {onVerify ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('tasks.verify.approveLabel', { title: task.title })}
          onPress={onVerify}
          disabled={isVerifying}
          className="h-9 justify-center rounded-button bg-brand-700 px-3 active:opacity-90">
          {isVerifying ? (
            <ActivityIndicator color={palette.neutral[0]} />
          ) : (
            <Text className="text-caption font-jakarta-bold text-white">{t('tasks.verify.short')}</Text>
          )}
        </Pressable>
      ) : null}
      {assignee ? (
        <View
          accessibilityLabel={assignee.name}
          className="h-[30px] w-[30px] items-center justify-center rounded-full"
          style={{ backgroundColor: assignee.color }}>
          <Text className="text-[12px] font-jakarta-bold" style={{ color: assignee.textColor }}>
            {assignee.initials}
          </Text>
        </View>
      ) : (
        <View className="h-[30px] w-[30px] items-center justify-center rounded-full border border-dashed border-neutral-400">
          <Plus size={14} color={semanticColors[scheme].textSecondary} />
        </View>
      )}
    </Pressable>
  );
}
