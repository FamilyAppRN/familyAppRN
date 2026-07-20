import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

interface ScreenHeaderProps {
  title: string;
  /** Contenido antes del título (avatares del hogar, botón atrás...). */
  left?: ReactNode;
  /** Contenido alineado a la derecha (ícono de sync, acciones...). */
  right?: ReactNode;
}

/** Cabecera simple de las pantallas del hogar (muestra el nombre del hogar). */
export function ScreenHeader({ title, left, right }: ScreenHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-6 pb-2 pt-2">
      <View className="flex-1 flex-row items-center gap-2.5">
        {left}
        <Text className="text-body font-jakarta-bold text-foreground" numberOfLines={1}>
          {title}
        </Text>
      </View>
      {right}
    </View>
  );
}
