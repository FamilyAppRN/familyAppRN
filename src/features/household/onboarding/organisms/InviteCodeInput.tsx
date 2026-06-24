import React, { useRef, useState } from 'react';
import { TextInput, View, StyleSheet, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import { palette } from '@shared/theme/tokens';

interface InviteCodeInputProps {
  value: string;
  onChange: (code: string) => void;
}

export function InviteCodeInput({ value, onChange }: InviteCodeInputProps) {
  const inputsRef = useRef<(TextInput | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  // Convert current value to 6 character array
  const codeArray = value.split('').concat(Array(6).fill('')).slice(0, 6);

  const handleTextChange = (text: string, index: number) => {
    // Normalize string and clean up non-alphanumeric characters
    const cleanText = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    const newCodeArray = [...codeArray];
    newCodeArray[index] = cleanText.slice(-1); // Take only the last character if multiple typed
    
    const newCode = newCodeArray.join('');
    onChange(newCode);

    // If text was added and it's not the last input, focus next input
    if (cleanText.length > 0 && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      // If the field is currently empty, focus the previous one and clear its content
      if (codeArray[index] === '' && index > 0) {
        const newCodeArray = [...codeArray];
        newCodeArray[index - 1] = '';
        onChange(newCodeArray.join(''));
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  return (
    <View className="flex-row justify-between w-full px-2 my-2">
      {Array(6)
        .fill(null)
        .map((_, index) => {
          const isFocused = focusedIndex === index;
          const borderClass = isFocused 
            ? 'border-brand-500' 
            : codeArray[index] 
              ? 'border-brand-300 bg-brand-50' 
              : 'border-line';

          return (
            <View 
              key={index}
              className={`w-[42px] h-[52px] rounded-xl border bg-surface items-center justify-center ${borderClass}`}
            >
              <TextInput
                ref={(ref) => {
                  inputsRef.current[index] = ref;
                }}
                className="w-full h-full text-center text-xl font-jakarta-semibold text-foreground"
                value={codeArray[index]}
                onChangeText={(text) => handleTextChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(null)}
                maxLength={2} // Allow 2 momentarily to catch fast typing/pasting
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
