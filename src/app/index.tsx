import { Redirect } from 'expo-router';
import { useAuthStore } from '@features/auth/store/useAuthStore';

// Gate de entrada tras el splash: a home si hay sesión, si no a Welcome.
export default function Index() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return <Redirect href={isAuthenticated ? '/(main)/home' : '/(auth)/welcome'} />;
}
