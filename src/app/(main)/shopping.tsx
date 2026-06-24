import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

export default function ShoppingRoute() {
  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-base px-4">
      <Text className="text-h1 font-jakarta-bold text-foreground">
        {t('tabs.shopping')}
      </Text>
    </SafeAreaView>
  );
}
