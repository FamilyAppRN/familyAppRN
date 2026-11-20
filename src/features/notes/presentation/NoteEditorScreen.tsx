import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { Pin, X } from 'lucide-react-native';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { palette } from '@shared/theme/tokens';
import { ThemeVarsProvider } from '@core/theme/ThemeVarsProvider';
import { NOTE_COLORS, NOTE_CONTENT_MAX, NOTE_TITLE_MAX } from '@features/notes/domain/notes';
import { useNoteEditor } from '@features/notes/presentation/useNoteEditor';

/**
 * Editor de nota a pantalla completa, con el color de la nota de fondo. Ese
 * color siempre es claro (ver NOTE_COLORS), así que el texto va oscuro.
 */
export function NoteEditorScreen() {
  const { t, i18n } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const editor = useNoteEditor(id);

  const footer = editor.isNew
    ? t('notes.editor.visibility')
    : `${t('notes.editor.visibility')} · ${t('notes.byline', {
        name: editor.author?.name ?? t('notes.someone'),
        date: editor.updatedAt
          ? new Date(editor.updatedAt).toLocaleDateString(i18n.language, { day: 'numeric', month: 'short' })
          : '',
      })}`;

  return (
    <ThemeVarsProvider>
      <SafeAreaView className="flex-1" edges={['top', 'bottom']} style={{ backgroundColor: editor.color }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
          <View className="flex-row items-center justify-between gap-2 px-4 pb-2 pt-2">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('notes.editor.cancel')}
              onPress={editor.goBack}
              className="h-11 w-11 items-center justify-center">
              <X size={22} color={palette.neutral[800]} />
            </Pressable>

            {editor.canEdit && !editor.notFound && !editor.isLoading ? (
              <View className="flex-row items-center gap-2">
                <Controller
                  control={editor.control}
                  name="pinned"
                  render={({ field: { value, onChange } }) => (
                    <Pressable
                      accessibilityRole="switch"
                      accessibilityState={{ checked: value }}
                      onPress={() => onChange(!value)}
                      className="h-10 flex-row items-center gap-1.5 rounded-button bg-neutral-950/10 px-3">
                      <Pin
                        size={16}
                        color={palette.neutral[950]}
                        fill={value ? palette.neutral[950] : 'transparent'}
                      />
                      <Text className="text-caption font-jakarta-bold text-neutral-950">
                        {t(value ? 'notes.editor.pinned' : 'notes.editor.notPinned')}
                      </Text>
                    </Pressable>
                  )}
                />
                <Pressable
                  accessibilityRole="button"
                  onPress={editor.save}
                  disabled={!editor.isValid || editor.isSaving}
                  className={`h-10 items-center justify-center rounded-button bg-brand-600 px-4 ${
                    !editor.isValid || editor.isSaving ? 'opacity-50' : ''
                  }`}>
                  {editor.isSaving ? (
                    <ActivityIndicator color={palette.neutral[0]} />
                  ) : (
                    <Text className="text-caption font-jakarta-bold text-white">{t('notes.editor.save')}</Text>
                  )}
                </Pressable>
              </View>
            ) : null}
          </View>

          {editor.isLoading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator color={palette.brand[600]} />
            </View>
          ) : editor.notFound ? (
            <View className="flex-1 items-center justify-center px-10">
              <Text className="text-center text-caption font-sans text-neutral-600">{t('notes.editor.notFound')}</Text>
            </View>
          ) : (
            <>
              <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, gap: 12, flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                {!editor.canEdit ? (
                  <Text className="text-caption font-sans text-neutral-600">{t('notes.editor.readOnly')}</Text>
                ) : null}
                <Controller
                  control={editor.control}
                  name="title"
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextInput
                      accessibilityLabel={t('notes.editor.titleLabel')}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      editable={editor.canEdit}
                      maxLength={NOTE_TITLE_MAX}
                      placeholder={t('notes.editor.titlePlaceholder')}
                      placeholderTextColor={palette.neutral[600]}
                      className="text-h1 font-jakarta-bold text-neutral-950"
                    />
                  )}
                />
                <Controller
                  control={editor.control}
                  name="content"
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextInput
                      accessibilityLabel={t('notes.editor.contentLabel')}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      editable={editor.canEdit}
                      multiline
                      textAlignVertical="top"
                      maxLength={NOTE_CONTENT_MAX}
                      placeholder={t('notes.editor.contentPlaceholder')}
                      placeholderTextColor={palette.neutral[600]}
                      className="min-h-[160px] flex-1 text-body font-sans text-neutral-800"
                    />
                  )}
                />
              </ScrollView>

              <View className="gap-3 px-5 pb-3">
                {editor.canEdit ? (
                  <Controller
                    control={editor.control}
                    name="color"
                    render={({ field: { value, onChange } }) => (
                      <View className="gap-2 rounded-card bg-neutral-0/70 p-3.5">
                        <Text className="text-caption font-jakarta-semibold text-neutral-800">
                          {t('notes.editor.color')}
                        </Text>
                        <View accessibilityRole="radiogroup" className="flex-row gap-3">
                          {NOTE_COLORS.map((option) => {
                            const selected = value === option.value;
                            return (
                              <Pressable
                                key={option.key}
                                accessibilityRole="radio"
                                accessibilityState={{ selected }}
                                accessibilityLabel={t(`notes.colors.${option.key}`)}
                                onPress={() => onChange(option.value)}
                                className={`h-11 w-11 items-center justify-center rounded-full border-2 ${
                                  selected ? 'border-neutral-950' : 'border-transparent'
                                }`}>
                                <View
                                  className="h-9 w-9 rounded-full border border-neutral-200"
                                  style={{ backgroundColor: option.value }}
                                />
                              </Pressable>
                            );
                          })}
                        </View>
                      </View>
                    )}
                  />
                ) : null}

                {editor.saveError ? (
                  <Text className="text-caption font-sans text-danger-700">{t('notes.editor.saveError')}</Text>
                ) : null}

                {editor.confirmingDelete ? (
                  <View accessibilityRole="alert" className="gap-3 rounded-card border border-neutral-200 bg-neutral-0 p-4 shadow-modal">
                    <Text className="text-h2 font-jakarta-bold text-neutral-950">{t('notes.editor.confirmTitle')}</Text>
                    <Text className="text-caption font-sans text-neutral-600">{t('notes.editor.confirmBody')}</Text>
                    <View className="flex-row gap-2">
                      <Pressable
                        accessibilityRole="button"
                        onPress={editor.cancelDelete}
                        className="h-12 flex-1 items-center justify-center rounded-button border border-neutral-200 bg-neutral-0 active:opacity-80">
                        <Text className="text-button font-jakarta-bold text-neutral-950">{t('notes.editor.cancel')}</Text>
                      </Pressable>
                      <Pressable
                        accessibilityRole="button"
                        onPress={editor.confirmDelete}
                        disabled={editor.isDeleting}
                        className="h-12 flex-1 items-center justify-center rounded-button bg-danger-700 active:opacity-90">
                        {editor.isDeleting ? (
                          <ActivityIndicator color={palette.neutral[0]} />
                        ) : (
                          <Text className="text-button font-jakarta-bold text-white">{t('notes.editor.confirm')}</Text>
                        )}
                      </Pressable>
                    </View>
                  </View>
                ) : (
                  <View className="flex-row items-center justify-between gap-3">
                    <Text className="flex-1 text-caption font-sans text-neutral-600" numberOfLines={2}>
                      {footer}
                    </Text>
                    {editor.canEdit && !editor.isNew ? (
                      <Pressable accessibilityRole="button" onPress={editor.askDelete} className="h-11 justify-center">
                        <Text className="text-button font-jakarta-bold text-danger-700">{t('notes.editor.delete')}</Text>
                      </Pressable>
                    ) : null}
                  </View>
                )}
              </View>
            </>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemeVarsProvider>
  );
}
