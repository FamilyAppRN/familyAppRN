import '@/global.css';
import '@core/i18n/i18n';

import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';

import { QueryProvider } from '@core/providers/QueryProvider';
import { initFirebase } from '@core/firebase/firebaseApp';
import { useHydrateTheme } from '@core/theme/useHydrateTheme';
import { useRestoreSession } from '@features/auth/session/useRestoreSession';
import { useAppColorScheme } from '@shared/theme/useAppColorScheme';
import { AnimatedSplashOverlay } from '@/components/animated-icon';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useAppColorScheme();
  const [loaded, error] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });
  const { isRestoring } = useRestoreSession();
  const { isHydrating: isHydratingTheme } = useHydrateTheme();

  useEffect(() => {
    initFirebase();
  }, []);

  useEffect(() => {
    if ((loaded || error) && !isRestoring && !isHydratingTheme) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error, isRestoring, isHydratingTheme]);

  // El splash se mantiene hasta que fuentes, sesión Y tema estén resueltos —
  // evita un flash a Welcome (o al tema equivocado) antes de confirmarlos.
  if ((!loaded && !error) || isRestoring || isHydratingTheme) return null;

  return (
    <QueryProvider>
      <SafeAreaProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <AnimatedSplashOverlay />
          <Stack screenOptions={{ headerShown: false }} />
        </ThemeProvider>
      </SafeAreaProvider>
    </QueryProvider>
  );
}
