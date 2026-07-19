import { useEffect, useState } from 'react';
import { useThemeStore } from '@core/theme/useThemeStore';

/** Aplica la preferencia de tema guardada antes del primer paint (evita flash). */
export function useHydrateTheme() {
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    useThemeStore
      .getState()
      .hydrate()
      .finally(() => setIsHydrating(false));
  }, []);

  return { isHydrating };
}
