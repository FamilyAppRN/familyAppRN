import { Text, View } from 'react-native';

interface ScreenHeaderProps {
  title: string;
}

/** Cabecera simple de las pantallas del hogar (muestra el nombre del hogar). */
export function ScreenHeader({ title }: ScreenHeaderProps) {
  return (
    <View className="px-6 pb-2 pt-2">
      <Text className="text-body font-jakarta-bold text-foreground">{title}</Text>
    </View>
  );
}
