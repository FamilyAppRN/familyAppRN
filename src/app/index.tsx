import { Redirect } from 'expo-router';
import { useAuthStore } from '@features/auth/store/useAuthStore';

// Gate de entrada tras el splash: a home si hay sesión, si no a Welcome.
export default function Index() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const households = useAuthStore((s) => s.households);

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/welcome" />;
  }

  if (households && households.length > 0) {
    return <Redirect href="/(main)/shopping" />;
  }

  return <Redirect href="/(auth)/household-onboarding" />;
}
