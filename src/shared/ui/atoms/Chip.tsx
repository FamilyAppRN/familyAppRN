import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  /** Contenido antes del texto (emoji, avatar chico...). */
  leading?: ReactNode;
}

/**
 * Chip seleccionable (categorías, unidades, filtros). Genérico: no conoce el
 * dominio. Sin `shadow-*` condicional a propósito — alternar esas clases
 * dispara el bug de NativeWind (ver ThemeSelector.tsx).
 */
export function Chip({ label, selected = false, onPress, leading }: ChipProps) {
  const Container = onPress ? Pressable : View;

  return (
    <Container
      {...(onPress ? { onPress, accessibilityRole: 'button' as const } : {})}
      accessibilityState={onPress ? { selected } : undefined}
      className={`flex-row items-center gap-1.5 rounded-badge px-3.5 py-2 ${
        selected ? 'border-[1.5px] border-brand-500 bg-chip' : 'border border-line bg-surface'
      }`}>
      {leading}
      <Text
        className={`text-caption ${
          selected ? 'font-jakarta-bold text-emphasis' : 'font-jakarta-semibold text-muted'
        }`}>
        {label}
      </Text>
    </Container>
  );
}
