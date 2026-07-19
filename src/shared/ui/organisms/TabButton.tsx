import { forwardRef } from 'react';
import { Pressable, View, type PressableProps } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { CalendarDays, FileText, ListChecks, ShoppingCart, User } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { palette, semanticColors } from '@shared/theme/tokens';
import { useAppColorScheme } from '@shared/theme/useAppColorScheme';

type IconComponent = React.ComponentType<{ color?: string; size?: number }>;

const ICONS: Record<string, IconComponent> = {
  shopping: ShoppingCart,
  tasks: ListChecks,
  notes: FileText,
  calendar: CalendarDays,
  settings: User,
};

// Props que inyecta <TabTrigger asChild>: isFocused + PressableProps (+ href, que
// no aplica a Pressable y se descarta).
type TabButtonProps = PressableProps & {
  routeName: string;
  isFocused?: boolean;
  href?: string;
};

export const TabButton = forwardRef<View, TabButtonProps>(function TabButton(
  { routeName, isFocused = false, href: _href, ...pressableProps },
  ref,
) {
  const { t } = useTranslation();
  const scheme = useAppColorScheme();
  const Icon = ICONS[routeName] ?? User;
  // Color por JS (no className/CSS var): TabButton es hijo de <TabTrigger
  // asChild>, otro punto donde expo-router/ui's <Slot> descarta estilos —
  // ver la nota larga en (main)/_layout.tsx.
  const iconColor = isFocused ? palette.neutral[0] : semanticColors[scheme].textSecondary;

  return (
    <Pressable ref={ref} accessibilityRole="button" {...pressableProps}>
      <Animated.View
        layout={LinearTransition.springify().mass(0.6).damping(14)}
        className={`items-center justify-center rounded-full ${
          isFocused ? 'flex-row bg-brand-600 px-5 py-2.5' : 'flex-col px-3 py-1'
        }`}>
        <Icon color={iconColor} size={22} />
        <Animated.Text
          layout={LinearTransition.springify()}
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(100)}
          style={{ color: iconColor }}
          className={
            isFocused ? 'ml-2 text-sm font-jakarta-semibold' : 'mt-1 text-[10px] font-jakarta-semibold'
          }>
          {t(`tabs.${routeName}`)}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
});
