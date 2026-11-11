import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { getHouseholdRepository } from '@features/household/data/householdFactory';
import { householdQueryKeys } from '@features/household/data/queryKeys';
import { useCurrentHousehold } from '@features/household/useCurrentHousehold';
import { useHouseholdMembers, type ResolvedMember } from '@features/household/useHouseholdMembers';
import { useAuthStore } from '@features/auth/store/useAuthStore';
import { shareInvite } from '@features/household/invite/shareInvite';

/** Acción destructiva esperando confirmación en la propia pantalla. */
export type PendingConfirm =
  | { kind: 'remove'; member: ResolvedMember }
  | { kind: 'leave' }
  | { kind: 'regenerate' }
  | null;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Pestaña Hogar: miembros, código para invitar y ajustes. Reglas del backend:
 * solo un admin renombra o quita a otros; quien creó el hogar no puede salir
 * ni ser quitado.
 */
export function useHouseholdHome() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const household = useCurrentHousehold();
  const householdId = household?.id as string;
  const userId = useAuthStore((s) => s.user?.id);
  const renameInSession = useAuthStore((s) => s.renameHousehold);
  const removeFromSession = useAuthStore((s) => s.removeHousehold);
  const { members, inviteCode, ownerId, isLoading } = useHouseholdMembers();

  const [editingName, setEditingName] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<PendingConfirm>(null);
  const [inviteEmail, setInviteEmail] = useState<string | null>(null);
  const [invitedEmail, setInvitedEmail] = useState<string | null>(null);

  const isAdmin = members.find((m) => m.id === userId)?.role === 'admin';
  const isOwner = !!userId && userId === ownerId;
  const detailKey = householdQueryKeys.details(householdId);

  // Admins primero; dentro de cada grupo, el usuario actual arriba y luego por nombre.
  const sortedMembers = [...members].sort((a, b) => {
    if (a.role !== b.role) return a.role === 'admin' ? -1 : 1;
    if (a.id === userId) return -1;
    if (b.id === userId) return 1;
    return a.name.localeCompare(b.name);
  });

  const renameMutation = useMutation({
    mutationFn: (name: string) => getHouseholdRepository().renameHousehold(householdId, name),
    onSuccess: (updated) => {
      renameInSession(householdId, updated.name);
      queryClient.setQueryData(detailKey, updated);
      setEditingName(null);
    },
  });

  const removeMutation = useMutation({
    mutationFn: (memberId: string) => getHouseholdRepository().removeMember(householdId, memberId),
    onSuccess: () => {
      setConfirm(null);
      void queryClient.invalidateQueries({ queryKey: detailKey });
    },
  });

  const leaveMutation = useMutation({
    mutationFn: () => getHouseholdRepository().removeMember(householdId, userId as string),
    onSuccess: () => {
      setConfirm(null);
      queryClient.removeQueries({ queryKey: detailKey });
      removeFromSession(householdId);
      // Sin hogares hay que elegir uno nuevo; si quedan, la pestaña muestra el siguiente.
      if (useAuthStore.getState().households.length === 0) {
        router.replace('/(auth)/household-onboarding');
      }
    },
  });

  const emailMutation = useMutation({
    mutationFn: (email: string) => getHouseholdRepository().sendInvitation(householdId, email),
    onSuccess: (_result, email) => {
      setInvitedEmail(email);
      setInviteEmail(null);
    },
  });

  const regenerateMutation = useMutation({
    mutationFn: () => getHouseholdRepository().regenerateInviteCode(householdId),
    onSuccess: (updated) => {
      queryClient.setQueryData(detailKey, updated);
      setConfirm(null);
    },
  });

  const trimmedName = editingName?.trim() ?? '';
  const trimmedEmail = inviteEmail?.trim() ?? '';

  return {
    householdName: household?.name ?? '',
    members: sortedMembers,
    userId,
    ownerId,
    isAdmin,
    isOwner,
    inviteCode,
    isLoading,
    shareInvite: () => {
      if (inviteCode) shareInvite(t, household?.name ?? '', inviteCode);
    },

    // Invitar por email (solo admin)
    inviteEmail,
    startEmailInvite: () => {
      setInvitedEmail(null);
      setInviteEmail('');
    },
    setInviteEmail,
    cancelEmailInvite: () => {
      setInviteEmail(null);
      emailMutation.reset();
    },
    canSendEmail: EMAIL_PATTERN.test(trimmedEmail) && !emailMutation.isPending,
    sendEmailInvite: () => emailMutation.mutate(trimmedEmail),
    isSendingEmail: emailMutation.isPending,
    emailError: emailMutation.isError,
    invitedEmail,

    // Código nuevo (solo admin)
    askRegenerate: () => setConfirm({ kind: 'regenerate' }),

    // Renombrar (solo admin)
    editingName,
    startRename: () => setEditingName(household?.name ?? ''),
    setEditingName,
    cancelRename: () => {
      setEditingName(null);
      renameMutation.reset();
    },
    canSaveName: trimmedName.length > 0 && trimmedName !== household?.name && !renameMutation.isPending,
    saveName: () => renameMutation.mutate(trimmedName),
    isRenaming: renameMutation.isPending,
    renameError: renameMutation.isError,

    // Quitar miembro (admin) y salir (cualquiera menos quien lo creó)
    canRemove: (member: ResolvedMember) => isAdmin && member.id !== userId && member.id !== ownerId,
    confirm,
    askRemove: (member: ResolvedMember) => setConfirm({ kind: 'remove', member }),
    askLeave: () => setConfirm({ kind: 'leave' }),
    cancelConfirm: () => {
      setConfirm(null);
      removeMutation.reset();
      leaveMutation.reset();
      regenerateMutation.reset();
    },
    confirmAction: () => {
      if (confirm?.kind === 'remove') removeMutation.mutate(confirm.member.id);
      if (confirm?.kind === 'leave') leaveMutation.mutate();
      if (confirm?.kind === 'regenerate') regenerateMutation.mutate();
    },
    isConfirming: removeMutation.isPending || leaveMutation.isPending || regenerateMutation.isPending,
    confirmError: removeMutation.isError || leaveMutation.isError || regenerateMutation.isError,
  };
}
