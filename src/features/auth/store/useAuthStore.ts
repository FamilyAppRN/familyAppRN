import { create } from 'zustand';
import type { User } from '@features/auth/domain/models/User';

interface AuthState {
  user: User | null;
  households: any[];
  isAuthenticated: boolean;
  setUser: (user: User, households?: any[]) => void;
  setHouseholds: (households: any[]) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  households: [],
  isAuthenticated: false,
  setUser: (user, households = []) => set({ user, households, isAuthenticated: true }),
  setHouseholds: (households) => set({ households }),
  clearUser: () => set({ user: null, households: [], isAuthenticated: false }),
}));
