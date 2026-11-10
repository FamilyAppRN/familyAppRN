import { Pressable, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { Avatar } from '@shared/ui/molecules/Avatar';
import { palette } from '@shared/theme/tokens';
import type { ResolvedMember } from '@features/household/useHouseholdMembers';
import type { ShoppingItemWithList } from '@features/shopping/presentation/useShopping';

interface ShoppingItemRowProps {
  item: ShoppingItemWithList;
  /** Miembro que lo agregó, ya resuelto (null si ya no está en el hogar). */
  addedBy: ResolvedMember | null;
  onToggle: () => void;
  /** Línea divisoria abajo (todas las filas de la tarjeta menos la última). */
  divider?: boolean;
}

/**
 * Fila dentro de la tarjeta de su categoría. Toda la fila marca o desmarca:
 * la casilla es solo visual para no anidar dos controles.
 */
export function ShoppingItemRow({ item, addedBy, onToggle, divider = false }: ShoppingItemRowProps) {
  const { t } = useTranslation();
  const done = item.is_completed;

  // 'unit' significa piezas: se muestra "3 u" en vez de solo el número.
  const unitLabel = item.unit && item.unit !== 'unit' ? t(`shopping.units.${item.unit}`) : t('shopping.unitShort');
  const quantityLabel = `${item.quantity} ${unitLabel}`;

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: done }}
      accessibilityLabel={`${item.name}, ${quantityLabel}`}
      onPress={onToggle}
      className={`min-h-[52px] flex-row items-center gap-3 px-3 py-2.5 active:opacity-80 ${
        divider ? 'border-b border-line' : ''
      }`}>
      <View
        className={`h-[22px] w-[22px] items-center justify-center rounded-md border-2 ${
          done ? 'border-brand-600 bg-brand-600' : 'border-neutral-400 bg-surface'
        }`}>
        {done ? <Check size={14} color={palette.neutral[0]} strokeWidth={3} /> : null}
      </View>

      <View className="flex-1">
        <Text
          className={`text-body ${done ? 'font-sans text-muted' : 'font-jakarta-semibold text-foreground'}`}
          style={done ? { textDecorationLine: 'line-through' } : undefined}>
          {item.name}
        </Text>
        {!done ? <Text className="text-caption font-sans text-muted">{quantityLabel}</Text> : null}
      </View>

      {!done && addedBy ? (
        <Avatar name={addedBy.name} size={26} color={addedBy.color} textColor={addedBy.textColor} bordered={false} />
      ) : null}
    </Pressable>
  );
}
