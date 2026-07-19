import { Pressable, Text, View } from 'react-native';
import { Camera } from 'lucide-react-native';

import { palette } from '@shared/theme/tokens';

interface AvatarProps {
  name: string;
  size?: number;
  /** Botón de cámara superpuesto (editar foto). Omitir para solo mostrar el avatar. */
  onEditPress?: () => void;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
}

/** Avatar circular con iniciales (no hay foto de perfil en el backend aún). */
export function Avatar({ name, size = 78, onEditPress }: AvatarProps) {
  return (
    <View style={{ width: size, height: size }}>
      <View
        style={{ width: size, height: size }}
        className="items-center justify-center rounded-full border-[3px] border-base bg-chip">
        <Text className="text-h2 font-jakarta-bold text-emphasis">{getInitials(name)}</Text>
      </View>

      {onEditPress ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Editar foto"
          onPress={onEditPress}
          className="absolute -bottom-0.5 -right-0.5 h-[26px] w-[26px] items-center justify-center rounded-full border-2 border-base bg-brand-500">
          <Camera size={14} color={palette.neutral[0]} />
        </Pressable>
      ) : null}
    </View>
  );
}
