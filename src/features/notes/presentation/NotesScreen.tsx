import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, StickyNote } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { EmptyState } from '@shared/ui/molecules/EmptyState';
import { ScreenHeader } from '@shared/ui/molecules/ScreenHeader';
import { palette } from '@shared/theme/tokens';
import { ThemeVarsProvider } from '@core/theme/ThemeVarsProvider';
import { useNotes } from '@features/notes/presentation/useNotes';

export function NotesScreen() {
  const { t } = useTranslation();
  const { householdName, notes, isLoading, isError } = useNotes();
  const [draft, setDraft] = useState('');

  return (
    <ThemeVarsProvider>
      <SafeAreaView className="flex-1 bg-base" edges={['top']}>
        <ScreenHeader title={householdName ?? ''} />

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color={palette.brand[500]} />
          </View>
        ) : isError ? (
          <View className="flex-1 items-center justify-center px-10">
            <Text className="text-center text-caption font-sans text-muted">
              {t('notes.loadError')}
            </Text>
          </View>
        ) : notes.length === 0 ? (
          <EmptyState
            Icon={StickyNote}
            tone="coral"
            title={t('notes.empty.title')}
            description={t('notes.empty.description')}
          />
        ) : (
          <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
            {notes.map((note) => (
              <View key={note.id} className="rounded-card border border-line bg-surface p-4">
                <Text className="text-body font-jakarta-semibold text-foreground">
                  {note.title}
                </Text>
                <Text className="mt-1 text-caption font-sans text-muted" numberOfLines={2}>
                  {note.content}
                </Text>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Barra de nota rápida (crear nota — pendiente de cablear al backend). */}
        <View className="flex-row items-center gap-2 border-t border-line bg-base px-4 py-3">
          <TextInput
            className="flex-1 text-body font-sans text-foreground"
            style={{ includeFontPadding: true }}
            value={draft}
            onChangeText={setDraft}
            placeholder={t('notes.inputPlaceholder')}
            placeholderTextColor={palette.neutral[400]}
          />
          <Pressable
            accessibilityRole="button"
            onPress={() => {}}
            className="h-9 w-9 items-center justify-center rounded-button bg-brand-500 active:opacity-90">
            <Send size={18} color={palette.neutral[0]} />
          </Pressable>
        </View>
      </SafeAreaView>
    </ThemeVarsProvider>
  );
}
