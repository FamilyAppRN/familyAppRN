import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter, type Href } from 'expo-router';

import { getNotesRepository } from '@features/notes/data/notesFactory';
import { notesQueryKeys } from '@features/notes/data/queryKeys';
import type { Note } from '@features/notes/data/schemas/notesSchema';
import { canEditNote, quickNoteFromText, sortNotes } from '@features/notes/domain/notes';
import { useCurrentHousehold } from '@features/household/useCurrentHousehold';
import { useHouseholdMembers } from '@features/household/useHouseholdMembers';
import { useAuthStore } from '@features/auth/store/useAuthStore';

export function useNotes() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const household = useCurrentHousehold();
  const householdId = household?.id as string;
  const userId = useAuthStore((s) => s.user?.id);
  const { members, resolveMember } = useHouseholdMembers();
  const queryKey = notesQueryKeys.byHousehold(householdId);
  const [draft, setDraft] = useState('');

  const query = useQuery({
    queryKey,
    queryFn: () => getNotesRepository().listByHousehold(householdId),
    enabled: !!householdId,
  });

  const notes = useMemo(() => query.data ?? [], [query.data]);
  const { pinned, others } = useMemo(() => sortNotes(notes), [notes]);
  const isAdmin = members.find((m) => m.id === userId)?.role === 'admin';

  const createMutation = useMutation({
    mutationFn: (body: { title: string; content: string }) => getNotesRepository().create(householdId, body),
    onSuccess: (note) => {
      queryClient.setQueryData<Note[]>(queryKey, (old) => [note, ...(old ?? [])]);
      setDraft('');
    },
  });

  const pinMutation = useMutation({
    mutationFn: (note: Note) => getNotesRepository().update(householdId, note.id, { pinned: !note.pinned }),
    // Optimista: la nota cambia de sección al instante y vuelve si falla.
    onMutate: async (note) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Note[]>(queryKey);
      queryClient.setQueryData<Note[]>(queryKey, (old) =>
        old?.map((n) => (n.id === note.id ? { ...n, pinned: !note.pinned } : n)),
      );
      return { previous };
    },
    onError: (_error, _note, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
  });

  const quickNote = quickNoteFromText(draft);

  return {
    householdName: household?.name,
    pinned,
    others,
    notes,
    isEmpty: notes.length === 0,
    isLoading: query.isLoading,
    isError: query.isError,
    isRefreshing: query.isRefetching,
    refresh: () => query.refetch(),
    resolveMember,
    canEdit: (note: Note) => canEditNote(note, userId, isAdmin),
    togglePin: (note: Note) => pinMutation.mutate(note),
    openNote: (note: Note) => router.push(`/(modals)/note/${note.id}` as Href),
    newNote: () => router.push('/(modals)/note/new' as Href),
    draft,
    setDraft,
    canPublish: !!quickNote && !createMutation.isPending,
    isPublishing: createMutation.isPending,
    publishError: createMutation.isError,
    publish: () => quickNote && createMutation.mutate(quickNote),
  };
}
