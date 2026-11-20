import { useRouter, type Href } from 'expo-router';

import { selectActiveHousehold, useAuthStore } from '@features/auth/store/useAuthStore';
import { canCreateHousehold, canJoinHousehold, planOf } from '@features/household/domain/planLimits';

export function useSwitchHousehold() {
  const router = useRouter();
  const households = useAuthStore((s) => s.households);
  const activeId = useAuthStore((s) => selectActiveHousehold(s)?.id);
  const setActiveHousehold = useAuthStore((s) => s.setActiveHousehold);
  const plan = planOf(useAuthStore((s) => s.user?.plan));

  const canCreate = canCreateHousehold(plan, households);
  const canJoin = canJoinHousehold(plan, households);

  return {
    households,
    activeId,
    canCreate,
    canJoin,
    isLimited: !canCreate || !canJoin,
    select: (id: string) => {
      setActiveHousehold(id);
      router.back();
    },
    // Crear y unirse comparten la pantalla de onboarding.
    addHousehold: (allowed: boolean) =>
      router.push((allowed ? '/(auth)/household-onboarding' : '/(modals)/premium') as Href),
    openPremium: () => router.push('/(modals)/premium' as Href),
    close: () => router.back(),
  };
}
