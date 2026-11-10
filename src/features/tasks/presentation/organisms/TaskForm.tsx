import { Pressable, Text, View } from 'react-native';
import { Controller, type Control } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { TextField } from '@shared/ui/molecules/TextField';
import { Button } from '@shared/ui/atoms/Button';
import { Chip } from '@shared/ui/atoms/Chip';
import type { ResolvedMember } from '@features/household/useHouseholdMembers';
import type { TaskFormData, TaskWhen } from '@features/tasks/presentation/taskFormSchema';
import { formatDue } from '@features/tasks/presentation/formatDue';

interface TaskFormProps {
  control: Control<TaskFormData>;
  members: ResolvedMember[];
  userId?: string;
  /** Fecha actual de la tarea al editar, para la opción de conservarla. */
  keepDate: Date | null;
  isEditing: boolean;
  onSubmit: () => void;
  isPending: boolean;
  isValid: boolean;
  hasError: boolean;
}

function FieldLabel({ children }: { children: string }) {
  return (
    <Text className="text-caption font-jakarta-bold uppercase tracking-wider text-muted">{children}</Text>
  );
}

interface MemberOptionProps {
  label: string;
  initials?: string;
  color?: string;
  selected: boolean;
  onPress: () => void;
}

function MemberOption({ label, initials, color, selected, onPress }: MemberOptionProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      onPress={onPress}
      className="w-14 items-center gap-1">
      <View
        className={`h-12 w-12 items-center justify-center rounded-full border-2 ${
          selected ? 'border-brand-600' : 'border-transparent'
        }`}>
        {initials ? (
          <View className="h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: color }}>
            <Text className="text-body font-jakarta-bold text-white">{initials}</Text>
          </View>
        ) : (
          <View className="h-10 w-10 rounded-full border-[1.5px] border-dashed border-neutral-400" />
        )}
      </View>
      <Text
        numberOfLines={1}
        className={`text-caption ${selected ? 'font-jakarta-bold text-foreground' : 'font-jakarta-semibold text-muted'}`}>
        {label}
      </Text>
    </Pressable>
  );
}

export function TaskForm({
  control,
  members,
  userId,
  keepDate,
  isEditing,
  onSubmit,
  isPending,
  isValid,
  hasError,
}: TaskFormProps) {
  const { t, i18n } = useTranslation();
  const whenOptions: TaskWhen[] = keepDate ? ['today', 'tomorrow', 'keep', 'none'] : ['today', 'tomorrow', 'none'];

  const whenLabel = (when: TaskWhen) => {
    if (when === 'keep' && keepDate) return formatDue(keepDate, t, i18n.language);
    if (when === 'none') return t('tasks.form.noDate');
    return t(`tasks.due.${when}`);
  };

  return (
    <View className="gap-5">
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <View className="gap-2">
            <FieldLabel>{t('tasks.form.titleLabel')}</FieldLabel>
            <TextField
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={error?.message ? t(error.message) : undefined}
              placeholder={t('tasks.form.titlePlaceholder')}
              autoCapitalize="sentences"
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="gap-2">
            <FieldLabel>{t('tasks.form.descriptionLabel')}</FieldLabel>
            <TextField
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('tasks.form.descriptionPlaceholder')}
              autoCapitalize="sentences"
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name="assigneeId"
        render={({ field: { onChange, value } }) => (
          <View className="gap-2">
            <FieldLabel>{t('tasks.form.who')}</FieldLabel>
            <View accessibilityRole="radiogroup" className="flex-row flex-wrap gap-2">
              {members.map((member) => (
                <MemberOption
                  key={member.id}
                  label={member.id === userId ? t('tasks.form.me') : member.name}
                  initials={member.initials}
                  color={member.color}
                  selected={value === member.id}
                  onPress={() => onChange(member.id)}
                />
              ))}
              <MemberOption label={t('tasks.form.nobody')} selected={value === null} onPress={() => onChange(null)} />
            </View>
          </View>
        )}
      />

      <Controller
        control={control}
        name="when"
        render={({ field: { onChange, value } }) => (
          <View className="gap-2">
            <FieldLabel>{t('tasks.form.when')}</FieldLabel>
            <View className="flex-row flex-wrap gap-2">
              {whenOptions.map((when) => (
                <Chip key={when} label={whenLabel(when)} selected={value === when} onPress={() => onChange(when)} />
              ))}
            </View>
          </View>
        )}
      />

      {hasError ? (
        <Text className="text-caption font-sans text-danger-700">{t('tasks.form.createError')}</Text>
      ) : null}

      <Button
        title={t(isEditing ? 'tasks.form.save' : 'tasks.form.create')}
        onPress={onSubmit}
        isLoading={isPending}
        disabled={!isValid}
      />
    </View>
  );
}
