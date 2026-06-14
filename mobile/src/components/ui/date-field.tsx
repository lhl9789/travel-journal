import { isValid, parse } from 'date-fns'
import { StyleSheet, TextInput, View } from 'react-native'

import { ThemedText } from '@/components/themed-text'
import { Spacing } from '@/constants/theme'
import { useTheme } from '@/hooks/use-theme'

interface DateFieldProps {
  label: string
  value: string
  onChangeText: (value: string) => void
  placeholder?: string
}

export function DateField({ label, value, onChangeText, placeholder = 'YYYY-MM-DD' }: DateFieldProps) {
  const theme = useTheme()
  const hasError = value.length > 0 && !isValid(parse(value, 'yyyy-MM-dd', new Date()))

  return (
    <View style={styles.container}>
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        keyboardType="numbers-and-punctuation"
        maxLength={10}
        style={[
          styles.input,
          {
            color: theme.text,
            backgroundColor: theme.backgroundElement,
            borderColor: hasError ? theme.danger : 'transparent',
          },
        ]}
      />
      {hasError && (
        <ThemedText type="small" themeColor="danger">
          YYYY-MM-DD 형식으로 입력해주세요
        </ThemedText>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.one,
  },
  input: {
    borderRadius: Spacing.two,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
})
