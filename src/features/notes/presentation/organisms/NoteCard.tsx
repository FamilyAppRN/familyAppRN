import { Pressable, Text, View } from 'react-native';
import { Pin } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { palette } from '@shared/theme/tokens';
import type { Note } from '@features/notes/data/schemas/notesSchema';
import { noteBody } from '@features/notes/domain/notes';
import type { ResolvedMember } from '@features/household/useHouseholdMembers';

interface NoteCardProps {
  note: Note;
  author: ResolvedMember | null;
  canEdit: boolean;
  onOpen: () => void;
  onTogglePin: () => void;
}

/**
 * Tarjeta tipo post-it. El fondo es el color que eligió el autor (dato del
 * backend), siempre claro, así que el texto va oscuro en ambos temas.
 */
export function NoteCard({ note, author, canEdit, onOpen, onTogglePin }: NoteCardProps) {
  const { t, i18n } = useTranslation();
  const body = noteBody(note);
  const date = note.updated_at ?? note.created_at;
  const dateLabel = date
    ? new Date(date).toLocaleDateString(i18n.language, { day: 'numeric', month: 'short' })
    : '';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onOpen}
      className="gap-1.5 rounded-card border border-neutral-200 p-3.5 active:opacity-90"
      style={{ backgroundColor: note.color }}>
      <View className="flex-row items-start gap-1">
        <Text className="flex-1 text-body font-jakarta-bold text-neutral-950" numberOfLines={2}>
          {note.title}
        </Text>
        {canEdit ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t(note.pinned ? 'notes.unpin' : 'notes.pin')}
            onPress={onTogglePin}
            hitSlop={10}
            className="-mr-1 -mt-1 h-8 w-8 items-center justify-center">
            <Pin
              size={16}
              color={note.pinned ? palette.neutral[950] : palette.neutral[600]}
              fill={note.pinned ? palette.neutral[950] : 'transparent'}
            />
          </Pressable>
        ) : note.pinned ? (
          <Pin size={16} color={palette.neutral[950]} fill={palette.neutral[950]} />
        ) : null}
      </View>
      {body ? (
        <Text className="text-caption font-sans text-neutral-800" numberOfLines={5}>
          {body}
        </Text>
      ) : null}
      <Text className="text-caption font-sans text-neutral-600" numberOfLines={1}>
        {t('notes.byline', { name: author?.name ?? t('notes.someone'), date: dateLabel })}
      </Text>
    </Pressable>
  );
}
