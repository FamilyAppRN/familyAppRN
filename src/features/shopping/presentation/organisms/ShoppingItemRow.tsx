import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Avatar } from '@shared/ui/molecules/Avatar';
import { Checkbox } from '@shared/ui/atoms/Checkbox';
import type { ResolvedMember } from '@features/household/useHouseholdMembers';
import type { ShoppingItemWithList } from '@features/shopping/presentation/useShopping';

interface ShoppingItemRowProps {
  item: ShoppingItemWithList;
  /** Miembro que lo agregó, ya resuelto (null si ya no está en el hogar). */
  addedBy: ResolvedMember | null;
  onToggle: () => void;
}

export function ShoppingItemRow({ item, addedBy, onToggle }: ShoppingItemRowProps) {
  const { t } = useTranslation();
  const done = item.is_completed;

  // 'unit' significa piezas: no se muestra sufijo, solo el número.
  const unitLabel = item.unit && item.unit !== 'unit' ? t(`shopping.units.${item.unit}`) : '';
  const quantityLabel = unitLabel ? `${item.quantity} ${unitLabel}` : `${item.quantity}`;

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: done }}
      accessibilityLabel={item.name}
      onPress={onToggle}
      // bg-chip (no brand-50) para que el estado completado también voltee con
      // el tema. Sin sombras condicionales acá — ver nota en ThemeSelector.tsx.
      className={`flex-row items-center gap-3 rounded-[14px] border p-3.5 ${
        done ? 'border-brand-500 bg-chip' : 'border-line bg-surface'
      }`}>
      <Checkbox checked={done} onChange={onToggle} />

      <View className="flex-1">
        <Text
          className={`text-body font-jakarta-semibold ${done ? 'text-muted' : 'text-foreground'}`}
          style={done ? { textDecorationLine: 'line-through' } : undefined}>
          {item.name}
        </Text>
        <Text className="mt-0.5 text-caption font-sans text-faint">{quantityLabel}</Text>
      </View>

      {/* Quien lo agregó. Al completarse se oculta, como en el mockup. */}
      {!done && addedBy ? (
        <Avatar name={addedBy.name} size={22} color={addedBy.color} bordered={false} />
      ) : null}
    </Pressable>
  );
}
