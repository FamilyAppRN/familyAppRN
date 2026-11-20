import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { palette } from '@shared/theme/tokens';
import { useAuthStore } from '@features/auth/store/useAuthStore';
import { parseInviteCode, usePendingInvite } from '@features/household/invite/usePendingInvite';

/**
 * Destino de gestia://join?code=XXXXXX. Guarda el código y deriva:
 * con sesión, al onboarding (que se une solo); sin sesión, a la bienvenida,
 * y el código espera a que inicie sesión.
 */
export function JoinLinkScreen() {
  const router = useRouter();
  const { code } = useLocalSearchParams<{ code?: string }>();

  useEffect(() => {
    const parsed = parseInviteCode(code);
    if (parsed) usePendingInvite.getState().setCode(parsed);
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    router.replace(isAuthenticated ? '/(auth)/household-onboarding' : '/(auth)/welcome');
  }, [code, router]);

  return (
    <View className="flex-1 items-center justify-center bg-base">
      <ActivityIndicator color={palette.brand[600]} />
    </View>
  );
}
