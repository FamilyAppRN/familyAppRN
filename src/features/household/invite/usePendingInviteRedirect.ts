import { useEffect } from 'react';
import { useRouter } from 'expo-router';

import { usePendingInvite } from '@features/household/invite/usePendingInvite';

/**
 * Si se abrió un enlace de invitación sin sesión, tras iniciar sesión se
 * llega a las pestañas: aquí se retoma y se abre el onboarding para unirse.
 */
export function usePendingInviteRedirect() {
  const router = useRouter();
  const code = usePendingInvite((s) => s.code);

  useEffect(() => {
    if (code) router.push('/(auth)/household-onboarding');
  }, [code, router]);
}
