import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabList, TabSlot, TabTrigger, Tabs } from 'expo-router/ui';
import type { Href } from 'expo-router';

import { TabButton } from '@shared/ui/organisms/TabButton';
import { semanticColors } from '@shared/theme/tokens';
import { useAppColorScheme } from '@shared/theme/useAppColorScheme';
import { useRealtimeSync } from '@features/household/realtime/useRealtimeSync';
import { usePushRegistration } from '@features/auth/push/usePushRegistration';
import { usePushNavigation } from '@features/household/push/usePushNavigation';
import { usePendingInviteRedirect } from '@features/household/invite/usePendingInviteRedirect';

// Tab bar propio construido con los componentes headless de Expo Router
// (expo-router/ui). Sin @react-navigation directo.
const TABS = [
  { name: 'shopping', href: '/shopping' },
  { name: 'tasks', href: '/tasks' },
  { name: 'notes', href: '/notes' },
  { name: 'calendar', href: '/calendar' },
  { name: 'household', href: '/household' },
] as const;

export default function MainLayout() {
  // Tiempo real para todas las pestañas: una conexión mientras se está aquí.
  useRealtimeSync();
  usePushRegistration();
  usePushNavigation();
  usePendingInviteRedirect();
  const insets = useSafeAreaInsets();
  const scheme = useAppColorScheme();

  return (
    <Tabs>
      <TabSlot />
      <TabList asChild>
        {/*
          Colores por JS (semanticColors[scheme]), NO por className/vars():
          <TabList asChild> usa expo-router/ui's <Slot> (@radix-ui/react-slot),
          que al fusionar props sobre ESTE hijo directo descarta cualquier
          --color-* de vars() en su `style` (confirmado inspeccionando el DOM
          — solo sobreviven propiedades RN "normales" como paddingBottom).
          Reactivo a useAppColorScheme() — confirmado seguro: el crash de
          navegación NO lo causaba ningún hook reactivo cerca de <Tabs>/
          <Stack>, sino una clase `shadow-*` alternada condicionalmente en
          ThemeSelector.tsx (bug conocido de NativeWind/cssInterop, ver nota
          ahí). Sin shadow-* acá, este patrón es seguro.
        */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            paddingHorizontal: 4,
            paddingTop: 8,
            borderTopWidth: 1,
            borderTopColor: semanticColors[scheme].border,
            backgroundColor: semanticColors[scheme].bgSurface,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 16,
          }}>
          {TABS.map((tab) => (
            <TabTrigger key={tab.name} name={tab.name} href={tab.href as Href} asChild>
              <TabButton routeName={tab.name} />
            </TabTrigger>
          ))}
        </View>
      </TabList>
    </Tabs>
  );
}
