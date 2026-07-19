import { type ComponentType } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Plus } from 'lucide-react-native';

import { palette, semanticColors } from '@shared/theme/tokens';
import { useAppColorScheme } from '@shared/theme/useAppColorScheme';

type Tone = 'green' | 'coral';

interface EmptyStateProps {
  Icon: ComponentType<{ color?: string; size?: number }>;
  tone?: Tone;
  title: string;
  description: string;
  /** CTA opcional (botón verde con "+"). Notas, p. ej., no lo usa. */
  cta?: { label: string; onPress: () => void };
}

/**
 * Estado vacío reutilizable: tile de ícono (verde/coral, theme-aware), título,
 * descripción y CTA opcional. Se centra en el espacio disponible.
 */
export function EmptyState({ Icon, tone = 'green', title, description, cta }: EmptyStateProps) {
  const scheme = useAppColorScheme();
  const tileClass = tone === 'green' ? 'bg-chip' : 'bg-accent-soft';
  const iconColor =
    tone === 'green'
      ? semanticColors[scheme].emphasis
      : scheme === 'dark'
        ? palette.accent[400]
        : palette.accent[600];

  return (
    <View className="flex-1 items-center justify-center px-10">
      <View className={`h-[84px] w-[84px] items-center justify-center rounded-[24px] ${tileClass}`}>
        <Icon color={iconColor} size={40} />
      </View>

      <Text className="mt-5 text-center text-h2 font-jakarta-bold text-foreground">{title}</Text>
      <Text className="mt-2 max-w-[280px] text-center text-caption font-sans text-muted">
        {description}
      </Text>

      {cta ? (
        <Pressable
          accessibilityRole="button"
          onPress={cta.onPress}
          className="mt-5 h-12 flex-row items-center justify-center gap-1.5 rounded-button bg-brand-500 px-6 shadow-card active:opacity-90">
          <Plus size={18} color={palette.neutral[0]} />
          <Text className="text-button font-jakarta-semibold text-white">{cta.label}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
