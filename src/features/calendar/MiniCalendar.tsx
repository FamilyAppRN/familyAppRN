import { Text, useColorScheme, View } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

import { semanticColors } from '@shared/theme/tokens';

const DOW = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const CELL_WIDTH = `${100 / 7}%`;

/**
 * Mini-calendario del mes actual (estático — el calendario familiar aún no
 * tiene backend). Lunes primero; resalta el día de hoy.
 */
export function MiniCalendar() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();

  const monthLabel = new Intl.DateTimeFormat(undefined, {
    month: 'long',
    year: 'numeric',
  }).format(now);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7; // lunes = 0
  const cells: (number | null)[] = [
    ...Array<null>(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <View className="mx-6 rounded-[18px] border border-line bg-surface p-4 shadow-card">
      <View className="mb-2.5 flex-row items-center justify-between">
        <ChevronLeft size={18} color={semanticColors[scheme].textSecondary} />
        <Text className="text-caption font-jakarta-bold capitalize text-foreground">
          {monthLabel}
        </Text>
        <ChevronRight size={18} color={semanticColors[scheme].textSecondary} />
      </View>

      <View className="flex-row flex-wrap">
        {DOW.map((d) => (
          <View key={d} style={{ width: CELL_WIDTH }} className="items-center py-1">
            <Text className="text-[10px] font-jakarta-bold text-faint">{d}</Text>
          </View>
        ))}
        {cells.map((day, idx) => (
          <View key={idx} style={{ width: CELL_WIDTH }} className="items-center py-1">
            {day ? (
              <Text
                className={
                  day === today
                    ? 'text-caption font-jakarta-bold text-emphasis'
                    : 'text-caption font-sans text-foreground'
                }>
                {day}
              </Text>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
}
