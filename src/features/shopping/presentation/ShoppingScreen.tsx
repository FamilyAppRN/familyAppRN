import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShoppingCart } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { EmptyState } from '@shared/ui/molecules/EmptyState';
import { ScreenHeader } from '@shared/ui/molecules/ScreenHeader';
import { palette } from '@shared/theme/tokens';
import { ThemeVarsProvider } from '@core/theme/ThemeVarsProvider';
import { useShopping } from '@features/shopping/presentation/useShopping';

export function ShoppingScreen() {
  const { t } = useTranslation();
  const { householdName, lists, isLoading, isError } = useShopping();

  return (
    <ThemeVarsProvider>
      <SafeAreaView className="flex-1 bg-base" edges={['top']}>
        <ScreenHeader title={householdName ?? ''} />

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
        ) : lists.length === 0 ? (
          <EmptyState
            Icon={ShoppingCart}
            tone="green"
            title={t('shopping.empty.title')}
            description={t('shopping.empty.description')}
            cta={{ label: t('shopping.empty.cta'), onPress: () => {} }}
          />
        ) : (
          <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
            {lists.map((list) => (
              <View key={list.id} className="rounded-card border border-line bg-surface p-4">
                <Text className="text-body font-jakarta-semibold text-foreground">
                  {list.name}
                </Text>
                <Text className="mt-1 text-caption font-sans text-muted">
                  {list.items.filter((i) => i.is_completed).length}/{list.items.length}
                </Text>
              </View>
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
    </ThemeVarsProvider>
  );
}
