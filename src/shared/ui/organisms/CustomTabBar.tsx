import { View, Pressable } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
// eslint-disable-next-line import/no-unresolved
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ShoppingCart, ListChecks, FileText, Users, Settings } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { palette } from '@shared/theme/tokens';

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const getIconForRoute = (routeName: string, color: string, size: number) => {
    switch (routeName) {
      case 'shopping': return <ShoppingCart color={color} size={size} />;
      case 'tasks': return <ListChecks color={color} size={size} />;
      case 'notes': return <FileText color={color} size={size} />;
      case 'family': return <Users color={color} size={size} />;
      case 'settings': return <Settings color={color} size={size} />;
      default: return <Settings color={color} size={size} />;
    }
  };

  return (
    <View
      className="flex-row items-center justify-around bg-base border-t border-border/50 pt-2 pb-4 shadow-sm"
      style={{ paddingBottom: insets.bottom > 0 ? insets.bottom : 16 }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <Pressable
            key={route.key}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
          >
            <Animated.View
              layout={LinearTransition.springify().mass(0.6).damping(14)}
              className={`items-center justify-center rounded-full ${
                isFocused ? "flex-row bg-brand-600 px-5 py-2.5" : "flex-col bg-transparent px-3 py-1"
              }`}
            >
              <Animated.View layout={LinearTransition.springify().mass(0.6).damping(14)}>
                {getIconForRoute(
                  route.name,
                  isFocused ? palette.neutral[0] : palette.neutral[600],
                  22
                )}
              </Animated.View>
              {isFocused ? (
                <Animated.Text 
                  layout={LinearTransition.springify()}
                  entering={FadeIn.duration(200)}
                  exiting={FadeOut.duration(100)}
                  className="ml-2 font-sans-medium text-sm text-white"
                >
                  {t(`tabs.${route.name}`)}
                </Animated.Text>
              ) : (
                <Animated.Text 
                  layout={LinearTransition.springify()}
                  entering={FadeIn.duration(200)}
                  exiting={FadeOut.duration(100)}
                  className="mt-1 font-sans-medium text-[10px] text-muted"
                >
                  {t(`tabs.${route.name}`)}
                </Animated.Text>
              )}
            </Animated.View>
          </Pressable>
        );
      })}
    </View>
  );
}
