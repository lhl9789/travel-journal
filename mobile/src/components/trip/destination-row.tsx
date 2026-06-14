import { format, parseISO } from 'date-fns'
import { SymbolView } from 'expo-symbols'
import { Pressable, StyleSheet, View } from 'react-native'

import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { Spacing } from '@/constants/theme'
import { useTheme } from '@/hooks/use-theme'

interface DestinationRowProps {
  countryFlag: string
  countryNameKo: string
  startDate: string
  endDate: string
  onRemove?: () => void
}

function formatDate(date: string) {
  return format(parseISO(date), 'yyyy.M.d')
}

/** 목적지 구간 행 — new.tsx / destinations.tsx 공용 */
export function DestinationRow({
  countryFlag,
  countryNameKo,
  startDate,
  endDate,
  onRemove,
}: DestinationRowProps) {
  const theme = useTheme()

  return (
    <ThemedView type="backgroundElement" style={styles.row}>
      <ThemedText style={styles.flag}>{countryFlag}</ThemedText>
      <View style={styles.info}>
        <ThemedText type="smallBold">{countryNameKo}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {formatDate(startDate)} - {formatDate(endDate)}
        </ThemedText>
      </View>
      {onRemove && (
        <Pressable onPress={onRemove} hitSlop={8}>
          <SymbolView
            name={{ ios: 'xmark.circle.fill', android: 'close', web: 'close' }}
            tintColor={theme.textSecondary}
            size={20}
          />
        </Pressable>
      )}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  flag: {
    fontSize: 24,
  },
  info: {
    flex: 1,
    gap: Spacing.half,
  },
})
