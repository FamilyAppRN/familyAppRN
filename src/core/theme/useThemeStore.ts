import { create } from 'zustand';
import { StorageService } from '@core/storage/StorageService';

export type ThemePreference = 'light' | 'dark' | 'system';

const STORAGE_KEY = '@gestia_theme_preference';
const storage = new StorageService();

function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system';
}

interface ThemeState {
  preference: ThemePreference;
  setPreference: (pref: ThemePreference) => void;
  hydrate: () => Promise<void>;
}

/**
 * Preferencia de tema, persistida. Solo guarda el dato — quien realmente
 * aplica el override visual es <ThemeVarsProvider> (via buildThemeVars +
 * vars()), reaccionando a este store.
 */
export const useThemeStore = create<ThemeState>((set) => ({
  preference: 'system',
  setPreference: (pref) => {
    void storage.set(STORAGE_KEY, pref);
    set({ preference: pref });
  },
  hydrate: async () => {
    const raw = await storage.get(STORAGE_KEY);
    set({ preference: isThemePreference(raw) ? raw : 'system' });
  },
}));
