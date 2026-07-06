import { Pressable, useColorScheme } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { semanticColors } from '@shared/theme/tokens';

interface Props {
  onPress: () => void;
}

/** Botón circular de "volver". No conoce el dominio ni la ruta de destino. */
export function BackButton({ onPress }: Props) {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Volver"
      hitSlop={8}
      onPress={onPress}
      className="h-12 w-12 items-center justify-center rounded-full border border-line bg-surface active:opacity-80">
      <ArrowLeft size={24} color={semanticColors[scheme].emphasis} />
    </Pressable>
  );
}
