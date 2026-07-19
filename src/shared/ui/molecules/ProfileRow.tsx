import { type ComponentType, type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

import { semanticColors } from '@shared/theme/tokens';
import { useAppColorScheme } from '@shared/theme/useAppColorScheme';

type IconComponent = ComponentType<{ color?: string; size?: number }>;

interface ProfileRowProps {
  Icon: IconComponent;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  /** Contenido a la derecha en vez del chevron (ej. los íconos de redes). */
  trailing?: ReactNode;
  /** Oculta la línea divisoria inferior (última fila de un grupo). */
  noBorder?: boolean;
}

/** Fila de lista del perfil: ícono + título/subtítulo + chevron (o trailing custom). */
export function ProfileRow({ Icon, title, subtitle, onPress, trailing, noBorder }: ProfileRowProps) {
  const scheme = useAppColorScheme();

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      onPress={onPress}
      className={`flex-row items-center gap-3 py-3 ${noBorder ? '' : 'border-b border-line'}`}>
      <Icon size={20} color={semanticColors[scheme].emphasis} />
      <View className="flex-1">
        <Text className="text-body font-jakarta-semibold text-foreground">{title}</Text>
        {subtitle ? <Text className="mt-0.5 text-caption font-sans text-muted">{subtitle}</Text> : null}
      </View>
      {trailing ?? (onPress ? <ChevronRight size={18} color={semanticColors[scheme].textFaint} /> : null)}
    </Pressable>
  );
}
