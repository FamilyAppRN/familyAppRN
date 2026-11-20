import { Pressable, Text, View } from 'react-native';
import { Controller, useWatch, type Control } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { TextField } from '@shared/ui/molecules/TextField';
import { DateTimeField } from '@shared/ui/molecules/DateTimeField';
import { Button } from '@shared/ui/atoms/Button';
import { Chip } from '@shared/ui/atoms/Chip';
import type { ResolvedMember } from '@features/household/useHouseholdMembers';
import { DEFAULT_TASK_TIME, TASK_POINTS, type TaskFormData } from '@features/tasks/presentation/taskFormSchema';
import { dateFromKey, dayKeyFromToday, dayKeyOf } from '@features/tasks/domain/dueDate';

interface TaskFormProps {
  control: Control<TaskFormData>;
  members: ResolvedMember[];
  userId?: string;
  isEditing: boolean;
  onSubmit: () => void;
  isPending: boolean;
  isValid: boolean;
  hasError: boolean;
  /** Puntos solo en hogares Premium; si no, se ofrece Premium. */
  isPremium: boolean;
  openPremium: () => void;
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
  textColor?: string;
  selected: boolean;
  onPress: () => void;
}

function MemberOption({ label, initials, color, textColor, selected, onPress }: MemberOptionProps) {
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
            <Text className="text-body font-jakarta-bold" style={{ color: textColor }}>
              {initials}
            </Text>
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

interface DueTimeFieldProps {
  control: Control<TaskFormData>;
  value: number | null;
  onChange: (value: number | null) => void;
  formatTime: (minutes: number) => string;
  locale: string;
}

/** "Todo el día" o una hora elegida con el selector. Se oculta sin fecha. */
function DueTimeField({ control, value, onChange, formatTime, locale }: DueTimeFieldProps) {
  const { t } = useTranslation();
  const dueDay = useWatch({ control, name: 'dueDay' });
  if (!dueDay) return null;

  const asDate = new Date();
  asDate.setHours(0, value ?? DEFAULT_TASK_TIME, 0, 0);

  return (
    <View className="gap-2">
      <FieldLabel>{t('tasks.form.time')}</FieldLabel>
      <DateTimeField
        mode="time"
        value={asDate}
        locale={locale}
        doneLabel={t('common.done')}
        // Medianoche exacta se guarda como "sin hora": se corre un minuto.
        onChange={(picked) => onChange(picked.getHours() * 60 + picked.getMinutes() || 1)}>
        {(open) => (
          <View className="flex-row flex-wrap gap-2">
            <Chip label={t('tasks.form.allDay')} selected={value === null} onPress={() => onChange(null)} />
            <Chip
              label={value !== null ? formatTime(value) : t('tasks.form.addTime')}
              selected={value !== null}
              onPress={open}
            />
          </View>
        )}
      </DateTimeField>
    </View>
  );
}

export function TaskForm({
  control,
  members,
  userId,
  isEditing,
  onSubmit,
  isPending,
  isValid,
  hasError,
  isPremium,
  openPremium,
}: TaskFormProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const today = dayKeyFromToday(0);
  const tomorrow = dayKeyFromToday(1);
  const formatDay = (key: string) =>
    dateFromKey(key).toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'short' });
  const formatTime = (minutes: number) =>
    dateFromKey(today, minutes).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });

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
                  textColor={member.textColor}
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
        name="dueDay"
        render={({ field: { onChange, value } }) => {
          const otherDay = value !== null && value !== today && value !== tomorrow;
          return (
            <View className="gap-2">
              <FieldLabel>{t('tasks.form.when')}</FieldLabel>
              <DateTimeField
                mode="date"
                value={value ? dateFromKey(value) : new Date()}
                minimumDate={dateFromKey(today)}
                locale={locale}
                doneLabel={t('common.done')}
                onChange={(picked) => onChange(dayKeyOf(picked))}>
                {(open) => (
                  <View className="flex-row flex-wrap gap-2">
                    <Chip label={t('tasks.due.today')} selected={value === today} onPress={() => onChange(today)} />
                    <Chip label={t('tasks.due.tomorrow')} selected={value === tomorrow} onPress={() => onChange(tomorrow)} />
                    <Chip
                      label={otherDay ? formatDay(value) : t('tasks.form.pickDate')}
                      selected={otherDay}
                      onPress={open}
                    />
                    <Chip label={t('tasks.form.noDate')} selected={value === null} onPress={() => onChange(null)} />
                  </View>
                )}
              </DateTimeField>
            </View>
          );
        }}
      />

      <Controller
        control={control}
        name="dueTime"
        render={({ field: { onChange, value } }) => (
          <DueTimeField control={control} value={value} onChange={onChange} formatTime={formatTime} locale={locale} />
        )}
      />

      {isPremium ? (
        <Controller
          control={control}
          name="points"
          render={({ field: { onChange, value } }) => (
            <View className="gap-2">
              <FieldLabel>{t('tasks.form.points')}</FieldLabel>
              <View className="flex-row flex-wrap gap-2">
                {TASK_POINTS.map((points) => (
                  <Chip
                    key={points}
                    label={points === 0 ? t('tasks.form.noPoints') : t('tasks.form.pointsValue', { count: points })}
                    selected={value === points}
                    onPress={() => onChange(points)}
                  />
                ))}
              </View>
            </View>
          )}
        />
      ) : (
        <Pressable
          accessibilityRole="button"
          onPress={openPremium}
          className="flex-row items-center gap-3 rounded-card border border-line bg-accent-soft px-3.5 py-3 active:opacity-80">
          <View className="flex-1">
            <Text className="text-body font-jakarta-bold text-foreground">{t('tasks.form.pointsPremiumTitle')}</Text>
            <Text className="text-caption font-sans text-muted">{t('tasks.form.pointsPremiumBody')}</Text>
          </View>
          <Text className="text-caption font-jakarta-bold text-foreground">{t('switcher.premium')}</Text>
        </Pressable>
      )}

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
