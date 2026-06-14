import { SymbolView } from 'expo-symbols'
import { useState } from 'react'
import { Pressable, StyleSheet, TextInput, View } from 'react-native'

import { ThemedText } from '@/components/themed-text'
import { Spacing } from '@/constants/theme'
import { useTheme } from '@/hooks/use-theme'

interface CompanionListProps {
  companions: string[]
  onChange: (companions: string[]) => void
}

/** 동행자 칩 목록 + 추가/삭제 입력 */
export function CompanionList({ companions, onChange }: CompanionListProps) {
  const theme = useTheme()
  const [input, setInput] = useState('')

  const handleAdd = () => {
    const trimmed = input.trim()
    if (!trimmed) {
      return
    }
    onChange([...companions, trimmed])
    setInput('')
  }

  const handleRemove = (index: number) => {
    onChange(companions.filter((_, i) => i !== index))
  }

  return (
    <View style={styles.container}>
      <View style={styles.chips}>
        <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
          <SymbolView
            name={{ ios: 'person.fill', android: 'person', web: 'person' }}
            tintColor={theme.onPrimary}
            size={14}
          />
        </View>
        {companions.map((name, index) => (
          <View key={`${name}-${index}`} style={[styles.chip, { backgroundColor: theme.backgroundElement }]}>
            <ThemedText type="small">{name}</ThemedText>
            <Pressable onPress={() => handleRemove(index)} hitSlop={8}>
              <SymbolView
                name={{ ios: 'xmark', android: 'close', web: 'close' }}
                tintColor={theme.textSecondary}
                size={12}
              />
            </Pressable>
          </View>
        ))}
      </View>
      <View style={styles.inputRow}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="동행자 이름 추가"
          placeholderTextColor={theme.textSecondary}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
          style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]}
        />
        <Pressable onPress={handleAdd} style={[styles.addButton, { backgroundColor: theme.primarySoft }]}>
          <SymbolView
            name={{ ios: 'plus', android: 'add', web: 'add' }}
            tintColor={theme.primary}
            size={16}
          />
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: Spacing.two,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    borderRadius: Spacing.five,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  input: {
    flex: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
