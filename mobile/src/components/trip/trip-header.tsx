import { useRouter } from 'expo-router'
import { SymbolView } from 'expo-symbols'
import { Pressable, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ThemedText } from '@/components/themed-text'
import { Spacing } from '@/constants/theme'
import { useTheme } from '@/hooks/use-theme'

interface TripHeaderProps {
  title: string
  tripId: string
  showMenu?: boolean
}

/**
 * 여행 상세 4탭 공용 상단바: 홈으로 이동, 여행/목적지 이름, "..." 메뉴
 */
export function TripHeader({ title, tripId, showMenu = true }: TripHeaderProps) {
  const router = useRouter()
  const theme = useTheme()
  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.container, { paddingTop: insets.top + Spacing.two }]}>
      <Pressable onPress={() => router.navigate('/')} style={styles.iconButton} hitSlop={8}>
        <SymbolView
          name={{ ios: 'house.fill', android: 'home', web: 'home' }}
          tintColor={theme.text}
          size={20}
        />
      </Pressable>

      <ThemedText type="smallBold" style={styles.title} numberOfLines={1}>
        {title}
      </ThemedText>

      {showMenu ? (
        <Pressable
          onPress={() => router.push(`/trip/${tripId}/menu`)}
          style={styles.iconButton}
          hitSlop={8}>
          <SymbolView
            name={{ ios: 'ellipsis', android: 'more_horiz', web: 'more_horiz' }}
            tintColor={theme.text}
            size={20}
          />
        </Pressable>
      ) : (
        <View style={styles.iconButton} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.two,
    gap: Spacing.two,
  },
  iconButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
})
