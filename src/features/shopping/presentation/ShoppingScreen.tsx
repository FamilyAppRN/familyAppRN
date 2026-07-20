import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus, RefreshCw, ShoppingCart } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { EmptyState } from '@shared/ui/molecules/EmptyState';
import { ScreenHeader } from '@shared/ui/molecules/ScreenHeader';
import { palette, semanticColors } from '@shared/theme/tokens';
import { useAppColorScheme } from '@shared/theme/useAppColorScheme';
import { ThemeVarsProvider } from '@core/theme/ThemeVarsProvider';
import { useHouseholdMembers } from '@features/household/useHouseholdMembers';
import { useShopping } from '@features/shopping/presentation/useShopping';
import { MemberAvatarStack } from '@features/shopping/presentation/organisms/MemberAvatarStack';
import { ShoppingItemRow } from '@features/shopping/presentation/organisms/ShoppingItemRow';

export function ShoppingScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const scheme = useAppColorScheme();
  const { members, resolveMember } = useHouseholdMembers();
  const {
    householdName,
    sections,
    totalItems,
    isLoading,
    isError,
    isRefreshing,
    refresh,
    toggleItem,
  } = useShopping();

  const goToNewItem = () => router.push('/(modals)/new-shopping-item');

  return (
    <ThemeVarsProvider>
      <SafeAreaView className="flex-1 bg-base" edges={['top']}>
        <ScreenHeader
          title={householdName ?? ''}
          left={<MemberAvatarStack members={members} />}
          right={
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('shopping.refresh')}
              hitSlop={8}
              onPress={() => refresh()}>
              <RefreshCw size={20} color={semanticColors[scheme].textSecondary} />
            </Pressable>
          }
        />

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color={palette.brand[500]} />
          </View>
        ) : isError ? (
          <View className="flex-1 items-center justify-center px-10">
            <Text className="text-center text-caption font-sans text-muted">
              {t('shopping.loadError')}
            </Text>
          </View>
        ) : totalItems === 0 ? (
          <EmptyState
            Icon={ShoppingCart}
            tone="green"
            title={t('shopping.empty.title')}
            description={t('shopping.empty.description')}
            cta={{ label: t('shopping.empty.cta'), onPress: goToNewItem }}
          />
        ) : (
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: 96 }}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={refresh}
                tintColor={palette.brand[500]}
              />
            }>
            {sections.map((section) => (
              <View key={section.category} className="mb-4">
                <Text className="mb-2 text-caption font-jakarta-bold uppercase tracking-wider text-muted">
                  {t(`shopping.categories.${section.category}`)}
                </Text>
                <View className="gap-2">
                  {section.items.map((item) => (
                    <ShoppingItemRow
                      key={item.id}
                      item={item}
                      addedBy={resolveMember(item.added_by)}
                      onToggle={() => toggleItem(item)}
                    />
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
        )}

        {/* FAB: oculto en vacío porque el EmptyState ya trae su propio CTA. */}
        {totalItems > 0 ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('shopping.empty.cta')}
            onPress={goToNewItem}
            className="absolute bottom-6 right-6 h-[52px] w-[52px] items-center justify-center rounded-[16px] bg-accent-500 active:opacity-90">
            <Plus size={26} color={palette.neutral[0]} />
          </Pressable>
        ) : null}
      </SafeAreaView>
    </ThemeVarsProvider>
  );
}
