import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CalendarDays } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { EmptyState } from '@shared/ui/molecules/EmptyState';
import { ThemeVarsProvider } from '@core/theme/ThemeVarsProvider';
import { MiniCalendar } from '@features/calendar/MiniCalendar';
import { HouseholdHeader } from '@features/household/HouseholdHeader';

export function CalendarScreen() {
  const { t } = useTranslation();

  return (
    <ThemeVarsProvider>
      <SafeAreaView className="flex-1 bg-base" edges={['top']}>
        <HouseholdHeader />
        <MiniCalendar />

        <View className="flex-1">
          <EmptyState
            Icon={CalendarDays}
            tone="green"
            title={t('calendar.empty.title')}
            description={t('calendar.empty.description')}
          />
        </View>
      </SafeAreaView>
    </ThemeVarsProvider>
  );
}
