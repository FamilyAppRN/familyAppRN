import { useState } from 'react';
import { useRouter } from 'expo-router';

import { useAuthStore } from '@features/auth/store/useAuthStore';

export type BillingPeriod = 'yearly' | 'monthly';

/**
 * Pantalla Premium. El cobro (tiendas + RevenueCat) llega en la Fase B; por
 * ahora solo se elige el período y el botón avisa que todavía no está.
 */
export function usePremium() {
  const router = useRouter();
  const isPremium = useAuthStore((s) => s.user?.plan === 'premium');
  const [period, setPeriod] = useState<BillingPeriod>('yearly');

  return {
    isPremium,
    period,
    setPeriod,
    canPurchase: false,
    close: () => router.back(),
  };
}
