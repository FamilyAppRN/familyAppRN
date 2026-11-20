import { useState, type ReactNode } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import DateTimePicker, { DateTimePickerAndroid, type DateTimePickerEvent } from '@react-native-community/datetimepicker';

import { palette } from '@shared/theme/tokens';

interface DateTimeFieldProps {
  mode: 'date' | 'time';
  value: Date;
  onChange: (value: Date) => void;
  /** Lo que se toca para abrir el selector (un chip, la hora grande...). */
  children: (open: () => void) => ReactNode;
  minimumDate?: Date;
  locale?: string;
  /** Texto del botón que cierra el selector en iOS. */
  doneLabel: string;
}

/**
 * Selector nativo de fecha u hora. En Android abre el diálogo del sistema;
 * en iOS lo muestra debajo del disparador hasta tocar "Listo". En web no hay
 * selector: el disparador se ve pero no abre nada.
 */
export function DateTimeField({ mode, value, onChange, children, minimumDate, locale, doneLabel }: DateTimeFieldProps) {
  const [iosOpen, setIosOpen] = useState(false);

  const open = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        mode,
        value,
        minimumDate,
        is24Hour: true,
        onChange: (event: DateTimePickerEvent, picked?: Date) => {
          if (event.type === 'set' && picked) onChange(picked);
        },
      });
    } else if (Platform.OS === 'ios') {
      setIosOpen((current) => !current);
    }
  };

  return (
    <View className="gap-2">
      {children(open)}
      {Platform.OS === 'ios' && iosOpen ? (
        <View className="overflow-hidden rounded-card border border-line bg-surface">
          <DateTimePicker
            mode={mode}
            value={value}
            minimumDate={minimumDate}
            locale={locale}
            display={mode === 'date' ? 'inline' : 'spinner'}
            accentColor={palette.brand[600]}
            onChange={(_event, picked) => {
              if (picked) onChange(picked);
            }}
          />
          <Pressable
            accessibilityRole="button"
            onPress={() => setIosOpen(false)}
            className="h-11 items-center justify-center border-t border-line active:opacity-70">
            <Text className="text-caption font-jakarta-bold text-emphasis">{doneLabel}</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}
