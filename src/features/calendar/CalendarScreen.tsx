import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CalendarDays } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { EmptyState } from '@shared/ui/molecules/EmptyState';
import { ScreenHeader } from '@shared/ui/molecules/ScreenHeader';
import { ThemeVarsProvider } from '@core/theme/ThemeVarsProvider';
import { MiniCalendar } from '@features/calendar/MiniCalendar';
import { useCurrentHousehold } from '@features/household/useCurrentHousehold';

export function CalendarScreen() {
  const { t } = useTranslation();
  const household = useCurrentHousehold();

  return (
    <ThemeVarsProvider>
      <SafeAreaView className="flex-1 bg-base" edges={['top']}>
        <ScreenHeader title={household?.name ?? ''} />
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
