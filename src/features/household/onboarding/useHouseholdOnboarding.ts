import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { getHouseholdRepository } from '@features/household/data/householdFactory';
import { useAuthStore } from '@features/auth/store/useAuthStore';
import { INVITE_CODE_LENGTH } from '@features/household/domain/inviteCode';
import { logout } from '@features/auth/logout';
import { usePendingInvite } from '@features/household/invite/usePendingInvite';


export function useHouseholdOnboarding() {
  const router = useRouter();
  const addHousehold = useAuthStore((s) => s.addHousehold);
  const hasHouseholds = useAuthStore((s) => s.households.length > 0);
  const userName = useAuthStore((s) => s.user?.name);
  const householdRepo = getHouseholdRepository();

  // Desde el selector (ya hay hogares) se cierran las pantallas apiladas encima
  // de las pestañas; en el primer ingreso se reemplaza el onboarding.
  const goHome = () =>
    hasHouseholds ? router.dismissTo('/(main)/shopping') : router.replace('/(main)/shopping');

  const [householdName, setHouseholdName] = useState('');
  // Si se llegó por un enlace de invitación, el código ya viene puesto.
  const [linkCode] = useState(() => usePendingInvite.getState().take());
  const [inviteCode, setInviteCode] = useState(linkCode ?? '');

  const createMutation = useMutation({
    mutationFn: (name: string) => householdRepo.createHousehold(name),
    onSuccess: (household) => {
      addHousehold({
        id: household.id,
        name: household.name,
        role: 'admin',
        is_owner: true,
        members_count: household.members.length,
      });
      goHome();
    },
  });

  const joinMutation = useMutation({
    mutationFn: (code: string) => householdRepo.joinHousehold(code),
    onSuccess: (household) => {
      addHousehold({
        id: household.id,
        name: household.name,
        role: 'member',
        is_owner: false,
        members_count: household.members.length,
      });
      goHome();
    },
  });

  const handleCreate = () => {
    const name = householdName.trim();
    if (name.length > 0 && !createMutation.isPending) {
      createMutation.mutate(name);
    }
  };

  // Acepta el código directo (auto-submit al completarlo) o usa el del
  // estado. Evita doble envío mientras la mutación está en curso.
  const handleJoin = (code?: string) => {
    const value = (code ?? inviteCode).trim().toUpperCase();
    if (value.length === INVITE_CODE_LENGTH && !joinMutation.isPending) {
      joinMutation.mutate(value);
    }
  };

  // ...y se usa una vez, sin que tenga que tocar nada.
  const triedLinkCode = useRef(false);
  useEffect(() => {
    if (linkCode && !triedLinkCode.current) {
      triedLinkCode.current = true;
      handleJoin(linkCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkCode]);

  return {
    /** Ya tiene hogares: vino desde el selector, así que puede volver. */
    canGoBack: hasHouseholds,
    goBack: () => router.back(),
    firstName: userName?.trim().split(/\s+/)[0],
    householdName,
    setHouseholdName,
    canCreate: householdName.trim().length > 0,
    onCreateHousehold: handleCreate,
    isCreating: createMutation.isPending,
    createError: createMutation.error?.message,

    inviteCode,
    setInviteCode,
    onJoinHousehold: handleJoin,
    isJoining: joinMutation.isPending,
    joinError: joinMutation.error?.message,

    onLogout: async () => {
      await logout();
      router.replace('/(auth)/welcome');
    },
  };
}
