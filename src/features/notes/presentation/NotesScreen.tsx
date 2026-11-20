import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pin, Plus, Send, StickyNote } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { EmptyState } from '@shared/ui/molecules/EmptyState';
import { palette, semanticColors } from '@shared/theme/tokens';
import { useAppColorScheme } from '@shared/theme/useAppColorScheme';
import { ThemeVarsProvider } from '@core/theme/ThemeVarsProvider';
import type { Note } from '@features/notes/data/schemas/notesSchema';
import { useNotes } from '@features/notes/presentation/useNotes';
import { NoteCard } from '@features/notes/presentation/organisms/NoteCard';
import { HouseholdHeader } from '@features/household/HouseholdHeader';

export function NotesScreen() {
  const { t } = useTranslation();
  const scheme = useAppColorScheme();
  const notes = useNotes();

  const renderCard = (note: Note) => (
    <NoteCard
      key={note.id}
      note={note}
      author={notes.resolveMember(note.author_id)}
      canEdit={notes.canEdit(note)}
      onOpen={() => notes.openNote(note)}
      onTogglePin={() => notes.togglePin(note)}
    />
  );

  // Dos columnas tipo tablero: se reparten alternadas para equilibrar alturas.
  const leftColumn = notes.others.filter((_, index) => index % 2 === 0);
  const rightColumn = notes.others.filter((_, index) => index % 2 === 1);

  return (
    <ThemeVarsProvider>
      <SafeAreaView className="flex-1 bg-base" edges={['top']}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
          <HouseholdHeader
            actions={
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t('notes.new')}
                onPress={notes.newNote}
                className="h-11 w-11 items-center justify-center">
                <Plus size={22} color={semanticColors[scheme].textPrimary} />
              </Pressable>
            }
          />

          {notes.isLoading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator color={palette.brand[600]} />
            </View>
          ) : notes.isError ? (
            <View className="flex-1 items-center justify-center px-10">
              <Text className="text-center text-caption font-sans text-muted">{t('notes.loadError')}</Text>
            </View>
          ) : notes.isEmpty ? (
            <EmptyState
              Icon={StickyNote}
              tone="coral"
              title={t('notes.empty.title')}
              description={t('notes.empty.description')}
            />
          ) : (
            <ScrollView
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, gap: 18 }}
              keyboardShouldPersistTaps="handled"
              refreshControl={
                <RefreshControl refreshing={notes.isRefreshing} onRefresh={notes.refresh} tintColor={palette.brand[600]} />
              }>
              <Text className="text-h1 font-jakarta-bold text-foreground">{t('notes.title')}</Text>

              {notes.pinned.length > 0 ? (
                <View className="gap-2">
                  <View className="flex-row items-center gap-1.5">
                    <Pin size={14} color={semanticColors[scheme].textSecondary} />
                    <Text className="text-caption font-jakarta-bold text-muted">{t('notes.pinnedSection')}</Text>
                  </View>
                  {notes.pinned.map(renderCard)}
                </View>
              ) : null}

              {notes.others.length > 0 ? (
                <View className="gap-2">
                  <Text className="text-caption font-jakarta-bold text-muted">{t('notes.recentSection')}</Text>
                  <View className="flex-row gap-2">
                    <View className="flex-1 gap-2">{leftColumn.map(renderCard)}</View>
                    <View className="flex-1 gap-2">{rightColumn.map(renderCard)}</View>
                  </View>
                </View>
              ) : null}
            </ScrollView>
          )}

          <View className="gap-1 border-t border-line bg-base px-4 py-2.5">
            {notes.publishError ? (
              <Text className="text-caption font-sans text-danger-700">{t('notes.publishError')}</Text>
            ) : null}
            <View className="flex-row items-end gap-2">
              <TextInput
                accessibilityLabel={t('notes.inputPlaceholder')}
                className="max-h-28 min-h-[46px] flex-1 rounded-[23px] border border-line bg-surface px-4 py-3 text-body font-sans text-foreground"
                value={notes.draft}
                onChangeText={notes.setDraft}
                placeholder={t('notes.inputPlaceholder')}
                placeholderTextColor={semanticColors[scheme].textFaint}
                multiline
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t('notes.publish')}
                onPress={notes.publish}
                disabled={!notes.canPublish}
                className={`h-[46px] w-[46px] items-center justify-center rounded-full bg-brand-600 active:opacity-90 ${
                  notes.canPublish ? '' : 'opacity-50'
                }`}>
                {notes.isPublishing ? (
                  <ActivityIndicator color={palette.neutral[0]} />
                ) : (
                  <Send size={20} color={palette.neutral[0]} />
                )}
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemeVarsProvider>
  );
}
