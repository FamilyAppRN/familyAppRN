import { Share } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useCurrentHousehold } from '@features/household/useCurrentHousehold';
import { useHouseholdMembers } from '@features/household/useHouseholdMembers';
import { useAuthStore } from '@features/auth/store/useAuthStore';

/** Pestaña Hogar: miembros con su rol y el código para invitar. */
export function useHouseholdHome() {
  const { t } = useTranslation();
  const household = useCurrentHousehold();
  const userId = useAuthStore((s) => s.user?.id);
  const { members, inviteCode, isLoading } = useHouseholdMembers();

  // Admins primero; dentro de cada grupo, el usuario actual arriba y luego por nombre.
  const sortedMembers = [...members].sort((a, b) => {
    if (a.role !== b.role) return a.role === 'admin' ? -1 : 1;
    if (a.id === userId) return -1;
    if (b.id === userId) return 1;
    return a.name.localeCompare(b.name);
  });

  return {
    members: sortedMembers,
    userId,
    inviteCode,
    isLoading,
    shareInvite: () => {
      if (!inviteCode) return;
      void Share.share({
        message: t('shopping.emptyState.shareMessage', { household: household?.name ?? '', code: inviteCode }),
      });
    },
  };
}
