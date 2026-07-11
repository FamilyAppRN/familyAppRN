import { useEffect, useState } from 'react';
import { getAuthRepository } from '@features/auth/data/authFactory';
import { useAuthStore } from '@features/auth/store/useAuthStore';

/**
 * Intenta rehidratar la sesión al abrir la app (una vez). El guardado/lectura
 * local vive en AuthRepository (capa de datos); este hook solo orquesta la
 * llamada y sincroniza el resultado con el store en memoria.
 */
export function useRestoreSession() {
  const [isRestoring, setIsRestoring] = useState(true);
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    let cancelled = false;

    getAuthRepository()
      .restoreSession()
      .then((result) => {
        if (cancelled || !result) return;
        setUser(result.user, result.households);
      })
      .finally(() => {
        if (!cancelled) setIsRestoring(false);
      });

    return () => {
      cancelled = true;
    };
  }, [setUser]);

  return { isRestoring };
}
