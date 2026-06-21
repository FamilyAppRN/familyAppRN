import { useRouter } from 'expo-router';

/** Welcome es presentación pura: el hook solo expone navegación. */
export function useWelcome() {
  const router = useRouter();

  return {
    goToLogin: () => router.navigate('/(auth)/login'),
    goToRegister: () => router.navigate('/(auth)/register'),
  };
}
