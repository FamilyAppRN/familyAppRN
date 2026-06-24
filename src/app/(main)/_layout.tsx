import { Tabs } from 'expo-router';
import { CustomTabBar } from '@shared/ui/organisms/CustomTabBar';

export default function MainLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="shopping" />
      <Tabs.Screen name="tasks" />
      <Tabs.Screen name="notes" />
      <Tabs.Screen name="family" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
