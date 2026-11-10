import { forwardRef } from 'react';
import { Pressable, Text, View, type PressableProps } from 'react-native';
import { Calendar, House, ShoppingCart, SquareCheckBig, StickyNote } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { semanticColors } from '@shared/theme/tokens';
import { useAppColorScheme } from '@shared/theme/useAppColorScheme';

type IconComponent = React.ComponentType<{ color?: string; size?: number }>;

const ICONS: Record<string, IconComponent> = {
  shopping: ShoppingCart,
  tasks: SquareCheckBig,
  notes: StickyNote,
  calendar: Calendar,
  household: House,
};

// Props que inyecta <TabTrigger asChild>: isFocused + PressableProps (+ href, que
// no aplica a Pressable y se descarta).
type TabButtonProps = PressableProps & {
  routeName: string;
  isFocused?: boolean;
  href?: string;
};

/**
 * Pestaña del rediseño: icono dentro de una píldora (rellena si está activa)
 * y la etiqueta siempre visible debajo, igual en las cinco pestañas.
 */
export const TabButton = forwardRef<View, TabButtonProps>(function TabButton(
  // `style` se descarta a propósito: <TabTrigger> inyecta
  // { flexDirection: 'row', justifyContent: 'space-between' }, que pondría el
  // icono al lado de la etiqueta y anularía el reparto del ancho.
  { routeName, isFocused = false, href: _href, style: _triggerStyle, ...pressableProps },
  ref,
) {
  const { t } = useTranslation();
  const scheme = useAppColorScheme();
  const Icon = ICONS[routeName] ?? House;
  // Colores por JS (no className/CSS var): TabButton es hijo de <TabTrigger
  // asChild>, otro punto donde expo-router/ui's <Slot> descarta estilos —
  // ver la nota larga en (main)/_layout.tsx.
  const color = isFocused ? semanticColors[scheme].emphasis : semanticColors[scheme].textSecondary;

  return (
    <Pressable
      ref={ref}
      {...pressableProps}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      style={{ flex: 1, flexDirection: 'column', alignItems: 'center', gap: 3, minHeight: 48, paddingVertical: 4 }}>
      <View
        style={{
          width: 52,
          height: 30,
          borderRadius: 999,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isFocused ? semanticColors[scheme].chip : 'transparent',
        }}>
        <Icon color={color} size={22} />
      </View>
      <Text
        numberOfLines={1}
        style={{ color, fontSize: 11, lineHeight: 14 }}
        className={isFocused ? 'font-jakarta-bold' : 'font-jakarta-semibold'}>
        {t(`tabs.${routeName}`)}
      </Text>
    </Pressable>
  );
});
