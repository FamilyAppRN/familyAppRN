import { Text, View } from 'react-native';
import { Controller, type Control } from 'react-hook-form';
import { Plus, ShoppingBasket } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { TextField } from '@shared/ui/molecules/TextField';
import { Button } from '@shared/ui/atoms/Button';
import { Chip } from '@shared/ui/atoms/Chip';
import { QuantityStepper } from '@shared/ui/atoms/QuantityStepper';
import { palette } from '@shared/theme/tokens';
import {
  CATEGORY_EMOJI,
  SHOPPING_CATEGORIES,
  SHOPPING_UNITS,
} from '@features/shopping/domain/categories';
import type { NewItemFormData } from '@features/shopping/presentation/newItemFormSchema';

interface NewItemFormProps {
  control: Control<NewItemFormData>;
  onSubmit: () => void;
  isPending: boolean;
  isValid: boolean;
  errorMessage?: string;
}

function FieldLabel({ children }: { children: string }) {
  return (
    <Text className="text-caption font-jakarta-bold uppercase tracking-wider text-muted">
      {children}
    </Text>
  );
}

export function NewItemForm({
  control,
  onSubmit,
  isPending,
  isValid,
  errorMessage,
}: NewItemFormProps) {
  const { t } = useTranslation();

  return (
    <View className="gap-4">
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <View className="gap-2">
            <FieldLabel>{t('shopping.newItem.nameLabel')}</FieldLabel>
            <TextField
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={error?.message ? t(error.message) : undefined}
              placeholder={t('shopping.newItem.namePlaceholder')}
              autoCapitalize="sentences"
              leftIcon={<ShoppingBasket size={20} color={palette.neutral[400]} />}
            />
          </View>
        )}
      />

      <View className="flex-row gap-2.5">
        <Controller
          control={control}
          name="quantity"
          render={({ field: { onChange, value } }) => (
            <View className="flex-1 gap-2">
              <FieldLabel>{t('shopping.newItem.quantityLabel')}</FieldLabel>
              <QuantityStepper value={value} onChange={onChange} />
            </View>
          )}
        />

        <Controller
          control={control}
          name="unit"
          render={({ field: { onChange, value } }) => (
            <View className="flex-1 gap-2">
              <FieldLabel>{t('shopping.newItem.unitLabel')}</FieldLabel>
              <View className="flex-row flex-wrap gap-1.5">
                {SHOPPING_UNITS.map((unit) => (
                  <Chip
                    key={unit}
                    label={t(`shopping.units.${unit}`)}
                    selected={value === unit}
                    onPress={() => onChange(unit)}
                  />
                ))}
              </View>
            </View>
          )}
        />
      </View>

      <Controller
        control={control}
        name="category"
        render={({ field: { onChange, value } }) => (
          <View className="gap-2">
            <FieldLabel>{t('shopping.newItem.categoryLabel')}</FieldLabel>
            <View className="flex-row flex-wrap gap-2">
              {SHOPPING_CATEGORIES.map((category) => (
                <Chip
                  key={category}
                  label={`${CATEGORY_EMOJI[category]} ${t(`shopping.categories.${category}`)}`}
                  selected={value === category}
                  onPress={() => onChange(category)}
                />
              ))}
            </View>
          </View>
        )}
      />

      {errorMessage ? (
        <Text className="text-caption font-sans text-danger-500">{errorMessage}</Text>
      ) : null}

      <Button
        title={t('shopping.newItem.submit')}
        onPress={onSubmit}
        isLoading={isPending}
        disabled={!isValid}
        rightIcon={<Plus size={18} color={palette.neutral[0]} />}
      />
    </View>
  );
}
