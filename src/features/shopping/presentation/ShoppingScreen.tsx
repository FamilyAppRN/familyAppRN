import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Check, Navigation, Plus } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { palette, semanticColors } from '@shared/theme/tokens';
import { useAppColorScheme } from '@shared/theme/useAppColorScheme';
import { ThemeVarsProvider } from '@core/theme/ThemeVarsProvider';
import { useHouseholdMembers } from '@features/household/useHouseholdMembers';
import { HouseholdHeader } from '@features/household/HouseholdHeader';
import { useShopping } from '@features/shopping/presentation/useShopping';
import { CategorySection } from '@features/shopping/presentation/organisms/CategorySection';
import { ShoppingItemRow } from '@features/shopping/presentation/organisms/ShoppingItemRow';
import { EmptyShopping } from '@features/shopping/presentation/organisms/EmptyShopping';

export function ShoppingScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const scheme = useAppColorScheme();
  const { resolveMember } = useHouseholdMembers();
  const {
    sections,
    cartItems,
    pendingCount,
    history,
    canFinalize,
    totalItems,
    isLoading,
    isError,
    isRefreshing,
    isFinalizing,
    refresh,
    toggleItem,
    finalizePurchase,
    quickAdd,
    isQuickAdding,
    inviteCode,
    isAlone,
    shareInvite,
  } = useShopping();

  const goToNewItem = () => router.push('/(modals)/new-shopping-item');

  return (
    <ThemeVarsProvider>
      <SafeAreaView className="flex-1 bg-base" edges={['top']}>
        <HouseholdHeader />

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color={palette.brand[600]} />
          </View>
        ) : isError ? (
          <View className="flex-1 items-center justify-center px-10">
            <Text className="text-center text-caption font-sans text-muted">{t('shopping.loadError')}</Text>
          </View>
        ) : totalItems === 0 ? (
          <EmptyShopping
            onQuickAdd={quickAdd}
            isAdding={isQuickAdding}
            inviteCode={inviteCode}
            showInvite={isAlone}
            onShareInvite={shareInvite}
          />
        ) : (
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 4, paddingBottom: 112, gap: 16 }}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={refresh} tintColor={palette.brand[600]} />
            }>
            <View className="flex-row items-baseline justify-between">
              <Text className="text-h1 font-jakarta-bold text-foreground">{t('shopping.title')}</Text>
              <Text className="text-caption font-sans text-muted">
                {t('shopping.pendingCount', { count: pendingCount })}
              </Text>
            </View>

            {/* "Voy al súper": el aviso a la familia llega con las notificaciones (A5). */}
            <View
              accessibilityLabel={`${t('shopping.goingShopping.title')}. ${t('shopping.goingShopping.soon')}`}
              className="flex-row items-center gap-3 rounded-card border border-line bg-chip p-3">
              <View className="h-10 w-10 items-center justify-center rounded-button bg-brand-600">
                <Navigation size={20} color={palette.neutral[0]} />
              </View>
              <View className="flex-1">
                <Text className="text-body font-jakarta-bold text-foreground">{t('shopping.goingShopping.title')}</Text>
                <Text className="text-caption font-sans text-muted">{t('shopping.goingShopping.description')}</Text>
              </View>
              <View className="rounded-badge bg-surface px-2 py-0.5">
                <Text className="text-caption font-jakarta-bold text-muted">{t('shopping.goingShopping.soon')}</Text>
              </View>
            </View>

            {sections.map((section) => (
              <CategorySection
                key={section.category}
                category={section.category}
                items={section.items}
                resolveMember={resolveMember}
                onToggle={toggleItem}
              />
            ))}

            {cartItems.length > 0 ? (
              <View className="gap-1.5">
                <Text accessibilityRole="header" className="text-caption font-jakarta-bold text-muted">
                  {t('shopping.inCart', { count: cartItems.length })}
                </Text>
                <View className="overflow-hidden rounded-card bg-surface-2">
                  {cartItems.map((item) => (
                    <ShoppingItemRow
                      key={item.id}
                      item={item}
                      addedBy={resolveMember(item.added_by)}
                      onToggle={() => toggleItem(item)}
                    />
                  ))}
                </View>
              </View>
            ) : null}

            {history.length > 0 ? (
              <View className="mt-2 gap-2">
                <Text accessibilityRole="header" className="text-caption font-jakarta-bold text-muted">
                  {t('shopping.history')}
                </Text>
                {history.map((h) => (
                  <View key={h.id} className="flex-row items-center gap-3 rounded-card border border-line bg-surface p-3.5">
                    <Check size={18} color={semanticColors[scheme].emphasis} />
                    <View className="flex-1">
                      <Text className="text-body font-jakarta-semibold text-foreground">
                        {new Date(h.completed_at).toLocaleDateString(i18n.language, {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                        })}
                      </Text>
                      <Text className="text-caption font-sans text-muted">
                        {t('shopping.historyLine', {
                          count: h.items.length,
                          name: resolveMember(h.completed_by)?.name ?? t('notes.someone'),
                        })}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : null}
          </ScrollView>
        )}

        {!isLoading && !isError ? (
          <View className="absolute bottom-5 left-4 right-4 flex-row items-center gap-3">
            {cartItems.length > 0 ? (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ disabled: !canFinalize || isFinalizing }}
                onPress={finalizePurchase}
                disabled={!canFinalize || isFinalizing}
                className="h-[52px] flex-1 flex-row items-center justify-center gap-2 rounded-[14px] border border-line bg-surface shadow-card active:opacity-80">
                {isFinalizing ? (
                  <ActivityIndicator color={palette.brand[600]} />
                ) : (
                  <>
                    <Check size={18} color={canFinalize ? semanticColors[scheme].emphasis : semanticColors[scheme].textFaint} />
                    <Text className={`text-button font-jakarta-bold ${canFinalize ? 'text-foreground' : 'text-muted'}`}>
                      {canFinalize ? t('shopping.finalize') : t('shopping.finalizeMissing', { count: pendingCount })}
                    </Text>
                  </>
                )}
              </Pressable>
            ) : (
              <View className="flex-1" />
            )}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('shopping.empty.cta')}
              onPress={goToNewItem}
              className="h-14 w-14 items-center justify-center rounded-[18px] bg-brand-600 active:opacity-90">
              <Plus size={26} color={palette.neutral[0]} />
            </Pressable>
          </View>
        ) : null}
      </SafeAreaView>
    </ThemeVarsProvider>
  );
}
