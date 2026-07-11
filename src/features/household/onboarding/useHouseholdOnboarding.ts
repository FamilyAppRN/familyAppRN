import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { getHouseholdRepository } from '@features/household/data/householdFactory';
import { useAuthStore } from '@features/auth/store/useAuthStore';

export function useHouseholdOnboarding() {
  const router = useRouter();
  const setHouseholds = useAuthStore((s) => s.setHouseholds);
  const householdRepo = getHouseholdRepository();

  const [householdName, setHouseholdName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [showCreateInput, setShowCreateInput] = useState(false);

  const createMutation = useMutation({
    mutationFn: (name: string) => householdRepo.createHousehold(name),
    onSuccess: (household) => {
      // Update store with new household
      setHouseholds([household]);
      // Redirect to main home screen
      router.replace('/(main)/shopping');
    },
  });

  const joinMutation = useMutation({
    mutationFn: (code: string) => householdRepo.joinHousehold(code),
    onSuccess: (household) => {
      // Update store with joined household
      setHouseholds([household]);
      // Redirect to main home screen
      router.replace('/(main)/shopping');
    },
  });

  const handleCreate = () => {
    if (!showCreateInput) {
      setShowCreateInput(true);
      return;
    }
    if (householdName.trim().length > 0) {
      createMutation.mutate(householdName.trim());
    }
  };

  // Acepta el código directo (auto-submit) o usa el del estado. Evita doble
  // envío mientras la mutación está en curso.
  const handleJoin = (code?: string) => {
    const value = (code ?? inviteCode).trim().toUpperCase();
    if (value.length === 6 && !joinMutation.isPending) {
      joinMutation.mutate(value);
    }
  };

  return {
    householdName,
    setHouseholdName,
    inviteCode,
    setInviteCode,
    showCreateInput,
    setShowCreateInput,

    // Actions
    onCreateHousehold: handleCreate,
    isCreating: createMutation.isPending,
    createError: createMutation.error?.message,

    onJoinHousehold: handleJoin,
    isJoining: joinMutation.isPending,
    joinError: joinMutation.error?.message,
  };
}
