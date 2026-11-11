import { useRouter, type Href } from 'expo-router';
import { useMutation } from '@tanstack/react-query';

import { useAuthStore } from '@features/auth/store/useAuthStore';
import { logout } from '@features/auth/logout';
import { getAuthRepository } from '@features/auth/data/authFactory';

export function useProfile() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);

  // Optimista: el interruptor cambia al instante y vuelve si el backend falla.
  const notificationsMutation = useMutation({
    mutationFn: (enabled: boolean) => getAuthRepository().setNotificationsEnabled(enabled),
    onMutate: (enabled) => {
      const previous = user?.notificationsEnabled ?? true;
      updateUser({ notificationsEnabled: enabled });
      return { previous };
    },
    onError: (_error, _enabled, context) => updateUser({ notificationsEnabled: context?.previous ?? true }),
  });

  return {
    name: user?.name ?? '',
    email: user?.email ?? '',
    isPremium: user?.plan === 'premium',
    notificationsEnabled: user?.notificationsEnabled ?? true,
    setNotificationsEnabled: (enabled: boolean) => notificationsMutation.mutate(enabled),
    notificationsError: notificationsMutation.isError,
    goBack: () => router.back(),
    openPremium: () => router.push('/(modals)/premium' as Href),
    logout: async () => {
      await logout();
      router.replace('/(auth)/welcome');
    },
  };
}
