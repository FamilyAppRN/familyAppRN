import { useRef, useState } from 'react';
import {
  TextInput,
  View,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
} from 'react-native';

interface InviteCodeInputProps {
  value: string;
  onChange: (code: string) => void;
  /** Se dispara cuando se completan los 6 caracteres (auto-submit). */
  onComplete?: (code: string) => void;
}

export function InviteCodeInput({ value, onChange, onComplete }: InviteCodeInputProps) {
  const inputsRef = useRef<(TextInput | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const codeArray = value.split('').concat(Array(6).fill('')).slice(0, 6);

  const handleTextChange = (text: string, index: number) => {
    const cleanText = text.toUpperCase().replace(/[^A-Z0-9]/g, '');

    const newCodeArray = [...codeArray];
    newCodeArray[index] = cleanText.slice(-1);

    const newCode = newCodeArray.join('');
    onChange(newCode);

    if (cleanText.length > 0 && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    if (newCode.length === 6) {
      inputsRef.current[index]?.blur();
      onComplete?.(newCode);
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (e.nativeEvent.key === 'Backspace' && codeArray[index] === '' && index > 0) {
      const newCodeArray = [...codeArray];
      newCodeArray[index - 1] = '';
      onChange(newCodeArray.join(''));
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <View className="my-2 w-full flex-row justify-between">
      {Array(6)
        .fill(null)
        .map((_, index) => {
          const isFocused = focusedIndex === index;
          const isFilled = Boolean(codeArray[index]);
          const borderClass = isFocused
            ? 'border-brand-500 bg-chip'
            : isFilled
              ? 'border-brand-500 bg-chip'
              : 'border-line-strong bg-base';

          return (
            <View
              key={index}
              className={`h-[52px] w-[44px] items-center justify-center rounded-xl border ${borderClass}`}>
              <TextInput
                ref={(ref) => {
                  inputsRef.current[index] = ref;
                }}
                className="h-full w-full text-center text-xl font-jakarta-semibold text-foreground"
                style={{ includeFontPadding: true }}
                value={codeArray[index]}
                onChangeText={(text) => handleTextChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(null)}
                maxLength={2}
                selectTextOnFocus
                autoCapitalize="characters"
                keyboardType="default"
                returnKeyType="done"
              />
            </View>
          );
        })}
    </View>
  );
}
