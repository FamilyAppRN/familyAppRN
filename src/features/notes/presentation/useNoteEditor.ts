import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

import { getNotesRepository } from '@features/notes/data/notesFactory';
import { notesQueryKeys } from '@features/notes/data/queryKeys';
import type { Note } from '@features/notes/data/schemas/notesSchema';
import { DEFAULT_NOTE_COLOR, canEditNote } from '@features/notes/domain/notes';
import { noteFormSchema, type NoteFormData } from '@features/notes/presentation/noteFormSchema';
import { useCurrentHousehold } from '@features/household/useCurrentHousehold';
import { useHouseholdMembers } from '@features/household/useHouseholdMembers';
import { useAuthStore } from '@features/auth/store/useAuthStore';

/** Ruta usada para una nota nueva: /(modals)/note/new */
export const NEW_NOTE_ID = 'new';

export function useNoteEditor(noteId: string) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const householdId = useCurrentHousehold()?.id as string;
  const userId = useAuthStore((s) => s.user?.id);
  const { members, resolveMember } = useHouseholdMembers();
  const queryKey = notesQueryKeys.byHousehold(householdId);
  const isNew = noteId === NEW_NOTE_ID;
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  // Comparte la query de la lista: si se abre directo, la carga igual.
  const query = useQuery({
    queryKey,
    queryFn: () => getNotesRepository().listByHousehold(householdId),
    enabled: !!householdId && !isNew,
  });
  const note = isNew ? undefined : query.data?.find((n) => n.id === noteId);

  const isAdmin = members.find((m) => m.id === userId)?.role === 'admin';
  const canEdit = isNew || (!!note && canEditNote(note, userId, isAdmin));

  const form = useForm<NoteFormData>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: { title: '', content: '', color: DEFAULT_NOTE_COLOR, pinned: false },
    mode: 'onChange',
  });

  useEffect(() => {
    if (note) {
      form.reset({ title: note.title, content: note.content, color: note.color, pinned: note.pinned });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note?.id]);

  const color = useWatch({ control: form.control, name: 'color' });

  const saveMutation = useMutation({
    mutationFn: (data: NoteFormData) => {
      const body = { title: data.title.trim(), content: data.content.trim(), color: data.color, pinned: data.pinned };
      return isNew
        ? getNotesRepository().create(householdId, body)
        : getNotesRepository().update(householdId, noteId, body);
    },
    onSuccess: (saved) => {
      queryClient.setQueryData<Note[]>(queryKey, (old) =>
        isNew ? [saved, ...(old ?? [])] : old?.map((n) => (n.id === saved.id ? saved : n)),
      );
      router.back();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => getNotesRepository().remove(householdId, noteId),
    onSuccess: () => {
      queryClient.setQueryData<Note[]>(queryKey, (old) => old?.filter((n) => n.id !== noteId));
      router.back();
    },
  });

  return {
    isNew,
    isLoading: !isNew && query.isLoading,
    notFound: !isNew && !query.isLoading && !note,
    canEdit,
    color,
    author: resolveMember(note?.author_id),
    updatedAt: note?.updated_at ?? note?.created_at,
    control: form.control,
    isValid: form.formState.isValid,
    save: form.handleSubmit((data) => saveMutation.mutate(data)),
    isSaving: saveMutation.isPending,
    saveError: saveMutation.isError,
    confirmingDelete,
    askDelete: () => setConfirmingDelete(true),
    cancelDelete: () => setConfirmingDelete(false),
    confirmDelete: () => deleteMutation.mutate(),
    isDeleting: deleteMutation.isPending,
    goBack: () => router.back(),
  };
}
