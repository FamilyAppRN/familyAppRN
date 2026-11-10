import { useRouter, type Href } from 'expo-router';

import { useAuthStore } from '@features/auth/store/useAuthStore';
import { logout } from '@features/auth/logout';

export function useProfile() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  return {
    name: user?.name ?? '',
    email: user?.email ?? '',
    isPremium: user?.plan === 'premium',
    goBack: () => router.back(),
    openPremium: () => router.push('/(modals)/premium' as Href),
    logout: async () => {
      await logout();
      router.replace('/(auth)/welcome');
    },
  };
}
