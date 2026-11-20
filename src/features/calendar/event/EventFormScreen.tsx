import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { CalendarDays, Minus, Plus } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { BackButton } from '@shared/ui/atoms/BackButton';
import { Button } from '@shared/ui/atoms/Button';
import { Chip } from '@shared/ui/atoms/Chip';
import { TextField } from '@shared/ui/molecules/TextField';
import { DateTimeField } from '@shared/ui/molecules/DateTimeField';
import { palette, semanticColors } from '@shared/theme/tokens';
import { useAppColorScheme } from '@shared/theme/useAppColorScheme';
import { ThemeVarsProvider } from '@core/theme/ThemeVarsProvider';
import { DURATIONS, REPEATS, useEventForm } from '@features/calendar/event/useEventForm';

function FieldLabel({ children }: { children: string }) {
  return <Text className="text-caption font-jakarta-bold uppercase tracking-wider text-muted">{children}</Text>;
}

/** Crear un evento (id "new", con ?date=) o editarlo. */
export function EventFormScreen() {
  const { t, i18n } = useTranslation();
  const scheme = useAppColorScheme();
  const { id, date } = useLocalSearchParams<{ id: string; date?: string }>();
  const form = useEventForm(id, date);
  const locale = i18n.language;
  const iconColor = semanticColors[scheme].textPrimary;

  return (
    <ThemeVarsProvider>
      <SafeAreaView className="flex-1 bg-base" edges={['top', 'bottom']}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
          <View className="flex-row items-center gap-2.5 px-6 pb-2 pt-2">
            <BackButton onPress={form.goBack} />
            <Text accessibilityRole="header" className="text-body font-jakarta-bold text-foreground">
              {t(form.isNew ? 'calendar.form.newTitle' : 'calendar.form.editTitle')}
            </Text>
          </View>

          {form.notFound ? (
            <View className="flex-1 items-center justify-center px-10">
              <Text className="text-center text-caption font-sans text-muted">{t('calendar.form.notFound')}</Text>
            </View>
          ) : (
            <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 40, gap: 20 }} keyboardShouldPersistTaps="handled">
              <View className="gap-2">
                <FieldLabel>{t('calendar.form.dayLabel')}</FieldLabel>
                <DateTimeField
                  mode="date"
                  value={form.day}
                  locale={locale}
                  doneLabel={t('common.done')}
                  onChange={form.setDay}>
                  {(open) => (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityHint={t('calendar.form.changeDay')}
                      disabled={!form.canEdit}
                      onPress={open}
                      className="min-h-[56px] flex-row items-center gap-3 rounded-card border border-line bg-surface px-3.5 py-2.5 active:opacity-70">
                      <CalendarDays size={20} color={iconColor} />
                      <Text className="flex-1 text-body font-jakarta-bold capitalize text-foreground">
                        {form.day.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                      </Text>
                      {form.canEdit ? (
                        <Text className="text-caption font-jakarta-bold text-emphasis">{t('calendar.form.change')}</Text>
                      ) : null}
                    </Pressable>
                  )}
                </DateTimeField>
              </View>

              <View className="gap-2">
                <FieldLabel>{t('calendar.form.titleLabel')}</FieldLabel>
                <TextField
                  value={form.title}
                  onChangeText={form.setTitle}
                  placeholder={t('calendar.form.titlePlaceholder')}
                  autoCapitalize="sentences"
                />
              </View>

              <View className="gap-2">
                <FieldLabel>{t('calendar.form.descriptionLabel')}</FieldLabel>
                <TextField
                  value={form.description}
                  onChangeText={form.setDescription}
                  placeholder={t('calendar.form.descriptionPlaceholder')}
                  autoCapitalize="sentences"
                />
              </View>

              <View className="flex-row items-center gap-3 rounded-card border border-line bg-surface px-3.5 py-3">
                <Text className="flex-1 text-body font-jakarta-semibold text-foreground">{t('calendar.allDay')}</Text>
                <Switch
                  accessibilityLabel={t('calendar.allDay')}
                  value={form.allDay}
                  onValueChange={form.setAllDay}
                  trackColor={{ true: palette.brand[600], false: palette.neutral[200] }}
                  thumbColor={palette.neutral[0]}
                />
              </View>

              {form.allDay ? null : (
                <>
                  <View className="gap-2">
                    <FieldLabel>{t('calendar.form.startLabel')}</FieldLabel>
                    <DateTimeField
                      mode="time"
                      value={form.startLabel}
                      locale={locale}
                      doneLabel={t('common.done')}
                      onChange={form.setStart}>
                      {(open) => (
                        <View className="flex-row items-center justify-between rounded-card border border-line bg-surface px-2 py-1.5">
                          <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={t('calendar.form.earlier')}
                            onPress={form.earlier}
                            className="h-11 w-11 items-center justify-center">
                            <Minus size={20} color={iconColor} />
                          </Pressable>
                          <Pressable
                            accessibilityRole="button"
                            accessibilityHint={t('calendar.form.pickTime')}
                            onPress={open}
                            className="min-h-[44px] justify-center px-3 active:opacity-70">
                            <Text className="text-h1 font-jakarta-bold text-foreground" style={{ fontVariant: ['tabular-nums'] }}>
                              {form.startLabel.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                          </Pressable>
                          <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={t('calendar.form.later')}
                            onPress={form.later}
                            className="h-11 w-11 items-center justify-center">
                            <Plus size={20} color={iconColor} />
                          </Pressable>
                        </View>
                      )}
                    </DateTimeField>
                  </View>

                  <View className="gap-2">
                    <FieldLabel>{t('calendar.form.endLabel')}</FieldLabel>
                    <DateTimeField
                      mode="time"
                      value={form.endLabel}
                      locale={locale}
                      doneLabel={t('common.done')}
                      onChange={form.setEnd}>
                      {(open) => (
                        <Pressable
                          accessibilityRole="button"
                          accessibilityHint={t('calendar.form.pickTime')}
                          onPress={open}
                          className="min-h-[56px] flex-row items-center justify-between rounded-card border border-line bg-surface px-3.5 py-2.5 active:opacity-70">
                          <Text className="text-h2 font-jakarta-bold text-foreground" style={{ fontVariant: ['tabular-nums'] }}>
                            {form.endLabel.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                          </Text>
                          <Text className="text-caption font-sans text-muted">
                            {form.endsNextDay ? t('calendar.form.nextDay') : t('calendar.form.change')}
                          </Text>
                        </Pressable>
                      )}
                    </DateTimeField>
                  </View>

                  <View className="gap-2">
                    <FieldLabel>{t('calendar.form.durationLabel')}</FieldLabel>
                    <View className="flex-row flex-wrap gap-2">
                      {DURATIONS.map((minutes) => (
                        <Chip
                          key={minutes}
                          label={t(`calendar.form.durations.${minutes}`)}
                          selected={form.duration === minutes}
                          onPress={() => form.setDuration(minutes)}
                        />
                      ))}
                    </View>
                  </View>
                </>
              )}

              <View className="gap-2">
                <FieldLabel>{t('calendar.form.repeatLabel')}</FieldLabel>
                <View className="flex-row flex-wrap gap-2">
                  {REPEATS.map((repeat) => (
                    <Chip
                      key={repeat}
                      label={t(`calendar.repeat.${repeat}`)}
                      selected={form.repeat === repeat}
                      onPress={() => form.setRepeat(repeat)}
                    />
                  ))}
                </View>
                {!form.isNew && form.repeat !== 'none' ? (
                  <Text className="text-caption font-sans text-muted">{t('calendar.form.seriesNote')}</Text>
                ) : null}
              </View>

              {form.saveError ? (
                <Text accessibilityRole="alert" className="text-caption font-sans text-danger-700">
                  {t('calendar.form.saveError')}
                </Text>
              ) : null}

              {form.canEdit ? (
                <Button
                  title={t(form.isNew ? 'calendar.form.create' : 'calendar.form.save')}
                  onPress={form.save}
                  isLoading={form.isSaving}
                  disabled={!form.canSave}
                />
              ) : (
                <Text className="text-center text-caption font-sans text-muted">{t('calendar.form.readOnly')}</Text>
              )}

              {!form.isNew && form.canEdit ? (
                form.confirmingDelete ? (
                  <View accessibilityRole="alert" className="gap-3 rounded-card border border-line bg-surface p-4">
                    <Text className="text-h2 font-jakarta-bold text-foreground">{t('calendar.form.confirmTitle')}</Text>
                    <Text className="text-caption font-sans text-muted">{t('calendar.form.confirmBody')}</Text>
                    <View className="flex-row gap-2">
                      <Pressable
                        accessibilityRole="button"
                        onPress={form.cancelDelete}
                        className="h-12 flex-1 items-center justify-center rounded-button border border-line bg-surface active:opacity-80">
                        <Text className="text-button font-jakarta-bold text-foreground">{t('tasks.detail.cancel')}</Text>
                      </Pressable>
                      <Pressable
                        accessibilityRole="button"
                        onPress={form.confirmDelete}
                        disabled={form.isDeleting}
                        className="h-12 flex-1 items-center justify-center rounded-button bg-danger-700 active:opacity-90">
                        {form.isDeleting ? (
                          <ActivityIndicator color={palette.neutral[0]} />
                        ) : (
                          <Text className="text-button font-jakarta-bold text-white">{t('tasks.detail.confirm')}</Text>
                        )}
                      </Pressable>
                    </View>
                  </View>
                ) : (
                  <Pressable accessibilityRole="button" onPress={form.askDelete} className="h-12 items-center justify-center active:opacity-70">
                    <Text className="text-button font-jakarta-bold text-danger-700">{t('calendar.form.delete')}</Text>
                  </Pressable>
                )
              ) : null}
            </ScrollView>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemeVarsProvider>
  );
}
