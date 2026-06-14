import { format, parseISO } from 'date-fns'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { Pressable, StyleSheet, View } from 'react-native'

import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { Spacing } from '@/constants/theme'
import { TripWithDestinations } from '@/data/trips'
import { useTheme } from '@/hooks/use-theme'

function formatDate(date: string) {
  return format(parseISO(date), 'yyyy. M. d.')
}

interface TripCardProps {
  trip: TripWithDestinations
}

/** 홈 목록 카드 — 첫 구간 국기+국가명+전체 기간, 추가 목적지 수 "+N" */
export function TripCard({ trip }: TripCardProps) {
  const router = useRouter()
  const theme = useTheme()
  const [first, ...rest] = trip.destinations

  return (
    <Pressable onPress={() => router.push(`/trip/${trip.id}`)} style={({ pressed }) => pressed && styles.pressed}>
      <ThemedView type="backgroundElement" style={styles.card}>
        {trip.coverImage ? (
          <Image source={{ uri: trip.coverImage }} style={styles.cover} />
        ) : (
          <View style={[styles.cover, { backgroundColor: theme.primarySoft }]} />
        )}
        <View style={styles.overlay}>
          <ThemedText type="smallBold" style={styles.overlayText}>
            {first ? `${first.countryFlag} ${first.countryNameKo}` : trip.name}
            {rest.length > 0 ? `  +${rest.length}` : ''}
          </ThemedText>
          <ThemedText type="small" style={styles.overlayText}>
            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
          </ThemedText>
        </View>
      </ThemedView>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
  card: {
    borderRadius: Spacing.three,
    overflow: 'hidden',
  },
  cover: {
    width: '100%',
    aspectRatio: 4 / 3,
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: Spacing.three,
    gap: Spacing.half,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  overlayText: {
    color: '#ffffff',
  },
})
