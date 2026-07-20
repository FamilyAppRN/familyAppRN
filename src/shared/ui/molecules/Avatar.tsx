import { Pressable, Text, View } from 'react-native';
import { Camera } from 'lucide-react-native';

import { palette } from '@shared/theme/tokens';

interface AvatarProps {
  name: string;
  size?: number;
  /** Color de fondo sólido (miembro). Sin él usa el verde suave de marca. */
  color?: string;
  /** Botón de cámara superpuesto (editar foto). Omitir para solo mostrar el avatar. */
  onEditPress?: () => void;
  /** Borde del color del fondo, para avatares superpuestos. */
  bordered?: boolean;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
}

/** Avatar circular con iniciales (no hay foto de perfil en el backend aún). */
export function Avatar({ name, size = 78, color, onEditPress, bordered = true }: AvatarProps) {
  // Fuente derivada del diámetro, acotada a [10, 18]. El tope de 18 hace que
  // el avatar grande del perfil (78) quede EXACTAMENTE como antes (text-h2),
  // y el piso de 10 mantiene legibles los badges chicos (22-30) de listas.
  const fontSize = Math.min(18, Math.max(10, Math.round(size * 0.4)));
  const borderWidth = bordered ? (size >= 48 ? 3 : 2) : 0;

  return (
    <View style={{ width: size, height: size }}>
      <View
        style={{
          width: size,
          height: size,
          borderWidth,
          ...(color ? { backgroundColor: color } : {}),
        }}
        className={`items-center justify-center rounded-full border-base ${
          color ? '' : 'bg-chip'
        }`}>
        <Text
          style={{ fontSize, color: color ? palette.neutral[0] : undefined }}
          className={`font-jakarta-bold ${color ? '' : 'text-emphasis'}`}>
          {getInitials(name)}
        </Text>
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
