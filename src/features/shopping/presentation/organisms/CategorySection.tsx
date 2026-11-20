import type { ComponentType } from 'react';
import { Text, View } from 'react-native';
import { Beef, Leaf, Milk, ShoppingBasket, Sparkles } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { avatarColors, semanticColors } from '@shared/theme/tokens';
import { useAppColorScheme } from '@shared/theme/useAppColorScheme';
import type { ShoppingCategory } from '@features/shopping/domain/categories';
import type { ResolvedMember } from '@features/household/useHouseholdMembers';
import type { ShoppingItemWithList } from '@features/shopping/presentation/useShopping';
import { ShoppingItemRow } from '@features/shopping/presentation/organisms/ShoppingItemRow';

type Icon = ComponentType<{ size?: number; color?: string }>;

/** Icono y tono de cada categoría (mismos tonos claros que los avatares). */
const CATEGORY_STYLE: Record<ShoppingCategory, { Icon: Icon; tone: (typeof avatarColors)[number] | null }> = {
  vegetables: { Icon: Leaf, tone: avatarColors[0] },
  dairy: { Icon: Milk, tone: avatarColors[3] },
  meat: { Icon: Beef, tone: avatarColors[1] },
  cleaning: { Icon: Sparkles, tone: null },
  other: { Icon: ShoppingBasket, tone: null },
};

interface CategorySectionProps {
  category: ShoppingCategory;
  items: ShoppingItemWithList[];
  resolveMember: (userId?: string | null) => ResolvedMember | null;
  onToggle: (item: ShoppingItemWithList) => void;
}

export function CategorySection({ category, items, resolveMember, onToggle }: CategorySectionProps) {
  const { t } = useTranslation();
  const scheme = useAppColorScheme();
  const { Icon, tone } = CATEGORY_STYLE[category];

  return (
    <View className="gap-1.5">
      <View className="flex-row items-center gap-2">
        <View
          className={`h-[26px] w-[26px] items-center justify-center rounded-full ${tone ? '' : 'bg-surface-2'}`}
          style={tone ? { backgroundColor: tone.bg } : undefined}>
          <Icon size={14} color={tone ? tone.fg : semanticColors[scheme].textSecondary} />
        </View>
        <Text accessibilityRole="header" className="text-caption font-jakarta-bold text-foreground">
          {t(`shopping.categories.${category}`)}
        </Text>
        <Text className="text-caption font-sans text-muted">{items.length}</Text>
      </View>

      <View className="overflow-hidden rounded-card border border-line bg-surface">
        {items.map((item, index) => (
          <ShoppingItemRow
            key={item.id}
            item={item}
            addedBy={resolveMember(item.added_by)}
            onToggle={() => onToggle(item)}
            divider={index < items.length - 1}
          />
        ))}
      </View>
    </View>
  );
}
