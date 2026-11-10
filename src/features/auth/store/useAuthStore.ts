import { create } from 'zustand';
import type { User } from '@features/auth/domain/models/User';
import { StorageService } from '@core/storage/StorageService';

/**
 * Hogar tal como lo guarda la sesión: el resumen de /api/users/me. Al crear o
 * unirse se arma con los datos que devuelve ese endpoint.
 */
export interface SessionHousehold {
  id: string;
  name: string;
  role?: 'admin' | 'member';
  is_owner?: boolean;
  members_count?: number;
}

const ACTIVE_HOUSEHOLD_KEY = '@gestia_active_household';
const storage = new StorageService();

interface AuthState {
  user: User | null;
  households: SessionHousehold[];
  /** Hogar elegido en el selector. null = el primero de la lista. */
  activeHouseholdId: string | null;
  isAuthenticated: boolean;
  setUser: (user: User, households?: SessionHousehold[]) => void;
  setHouseholds: (households: SessionHousehold[]) => void;
  /** Suma un hogar recién creado o unido y lo deja activo. */
  addHousehold: (household: SessionHousehold) => void;
  setActiveHousehold: (id: string) => void;
  renameHousehold: (id: string, name: string) => void;
  /** Saca un hogar de la sesión (al salir). Si era el activo, pasa al primero que quede. */
  removeHousehold: (id: string) => void;
  /** Recupera el hogar activo guardado, si sigue en la lista. */
  hydrateActiveHousehold: () => Promise<void>;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  households: [],
  activeHouseholdId: null,
  isAuthenticated: false,
  setUser: (user, households = []) => set({ user, households, isAuthenticated: true }),
  setHouseholds: (households) => set({ households }),
  addHousehold: (household) => {
    const others = get().households.filter((h) => h.id !== household.id);
    void storage.set(ACTIVE_HOUSEHOLD_KEY, household.id);
    set({ households: [...others, household], activeHouseholdId: household.id });
  },
  setActiveHousehold: (id) => {
    void storage.set(ACTIVE_HOUSEHOLD_KEY, id);
    set({ activeHouseholdId: id });
  },
  renameHousehold: (id, name) =>
    set({ households: get().households.map((h) => (h.id === id ? { ...h, name } : h)) }),
  removeHousehold: (id) => {
    const households = get().households.filter((h) => h.id !== id);
    const activeHouseholdId = get().activeHouseholdId === id ? (households[0]?.id ?? null) : get().activeHouseholdId;
    if (activeHouseholdId) void storage.set(ACTIVE_HOUSEHOLD_KEY, activeHouseholdId);
    else void storage.remove(ACTIVE_HOUSEHOLD_KEY);
    set({ households, activeHouseholdId });
  },
  hydrateActiveHousehold: async () => {
    const stored = await storage.get(ACTIVE_HOUSEHOLD_KEY);
    if (stored && get().households.some((h) => h.id === stored)) {
      set({ activeHouseholdId: stored });
    }
  },
  clearUser: () => {
    void storage.remove(ACTIVE_HOUSEHOLD_KEY);
    set({ user: null, households: [], activeHouseholdId: null, isAuthenticated: false });
  },
}));

/** El hogar activo, o el primero si no hay uno elegido o ya no existe. */
export function selectActiveHousehold(state: AuthState): SessionHousehold | undefined {
  return state.households.find((h) => h.id === state.activeHouseholdId) ?? state.households[0];
}
