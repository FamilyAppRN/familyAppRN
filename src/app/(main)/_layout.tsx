import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabList, TabSlot, TabTrigger, Tabs } from 'expo-router/ui';
import type { Href } from 'expo-router';

import { TabButton } from '@shared/ui/organisms/TabButton';

// Tab bar propio construido con los componentes headless de Expo Router
// (expo-router/ui). Sin @react-navigation directo.
const TABS = [
  { name: 'shopping', href: '/shopping' },
  { name: 'tasks', href: '/tasks' },
  { name: 'notes', href: '/notes' },
  { name: 'calendar', href: '/calendar' },
  { name: 'settings', href: '/settings' },
] as const;

export default function MainLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs>
      <TabSlot />
      <TabList
        asChild>
        <View
          className="flex-row items-center justify-around border-t border-line bg-base pt-2"
          style={{ paddingBottom: insets.bottom > 0 ? insets.bottom : 12 }}>
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
