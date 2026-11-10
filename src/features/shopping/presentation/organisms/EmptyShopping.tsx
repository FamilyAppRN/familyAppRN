import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Share2, ShoppingCart } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { palette, semanticColors } from '@shared/theme/tokens';
import { useAppColorScheme } from '@shared/theme/useAppColorScheme';
import { QUICK_ADD_ITEMS, type ShoppingCategory } from '@features/shopping/domain/categories';

interface EmptyShoppingProps {
  onQuickAdd: (name: string, category: ShoppingCategory) => void;
  isAdding: boolean;
  /** Código del hogar; la tarjeta de invitar solo aparece si estás solo. */
  inviteCode?: string;
  showInvite: boolean;
  onShareInvite: () => void;
}

/**
 * Primer uso: en vez de una ilustración sola, atajos para agregar lo de
 * siempre con un toque y, si nadie más se unió, el código para invitar.
 */
export function EmptyShopping({ onQuickAdd, isAdding, inviteCode, showInvite, onShareInvite }: EmptyShoppingProps) {
  const { t } = useTranslation();
  const scheme = useAppColorScheme();

  return (
    <View className="gap-3.5 px-4 pt-2">
      <View className="gap-3.5 rounded-[20px] border border-line bg-surface p-5">
        <View className="h-12 w-12 items-center justify-center rounded-card bg-chip">
          <ShoppingCart size={24} color={semanticColors[scheme].emphasis} />
        </View>
        <View className="gap-1">
          <Text accessibilityRole="header" className="text-h2 font-jakarta-bold text-foreground">
            {t('shopping.empty.title')}
          </Text>
          <Text className="text-caption font-sans text-muted">{t('shopping.emptyState.quickHint')}</Text>
        </View>
        <View className="flex-row flex-wrap gap-2">
          {QUICK_ADD_ITEMS.map(({ key, category }) => {
            const name = t(`shopping.quickAdd.${key}`);
            return (
              <Pressable
                key={key}
                accessibilityRole="button"
                accessibilityLabel={t('shopping.emptyState.addOne', { name })}
                disabled={isAdding}
                onPress={() => onQuickAdd(name, category)}
                className="h-10 justify-center rounded-badge border border-line bg-base px-3.5 active:opacity-70">
                <Text className="text-caption font-jakarta-semibold text-foreground">+ {name}</Text>
              </Pressable>
            );
          })}
          {isAdding ? <ActivityIndicator color={palette.brand[600]} /> : null}
        </View>
      </View>

      {showInvite && inviteCode ? (
        <View className="gap-3 rounded-[20px] border border-line bg-chip p-5">
          <View className="gap-1">
            <Text className="text-body font-jakarta-bold text-foreground">{t('shopping.emptyState.inviteTitle')}</Text>
            <Text className="text-caption font-sans text-muted">{t('shopping.emptyState.inviteBody')}</Text>
          </View>
          <View className="flex-row items-center gap-2.5">
            <View className="h-12 flex-1 items-center justify-center rounded-button border border-line bg-surface">
              <Text
                accessibilityLabel={t('shopping.emptyState.codeLabel', { code: inviteCode.split('').join(' ') })}
                className="text-h2 font-jakarta-bold tracking-[4px] text-emphasis">
                {inviteCode}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={onShareInvite}
              className="h-12 flex-row items-center gap-2 rounded-button bg-brand-600 px-4 active:opacity-90">
              <Share2 size={16} color={palette.neutral[0]} />
              <Text className="text-caption font-jakarta-bold text-white">{t('shopping.emptyState.invite')}</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
}
