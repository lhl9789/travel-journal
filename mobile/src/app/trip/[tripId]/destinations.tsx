import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { DestinationRow } from '@/components/trip/destination-row';
import { Spacing } from '@/constants/theme';
import { addDestination, removeDestination } from '@/data/tripDestinations';
import { useTheme } from '@/hooks/use-theme';
import { useTrip } from '@/hooks/use-trip';
import { takeDraftDestination } from '@/utils/draft-destination';

/** 목적지 구간 추가/삭제 (PRD 3.1) — 국가 선택은 trip/country 재사용 */
export default function TripDestinationsScreen() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const db = useSQLiteContext();
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { trip, refresh } = useTrip(tripId);

  useFocusEffect(
    useCallback(() => {
      const draft = takeDraftDestination();
      if (draft) {
        addDestination(db, tripId, draft).then(refresh);
      }
    }, [db, tripId, refresh]),
  );

  const handleRemove = async (destinationId: string) => {
    if (!trip || trip.destinations.length <= 1) {
      return;
    }
    await removeDestination(db, destinationId);
    refresh();
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Pressable onPress={() => router.back()} style={styles.iconButton} hitSlop={8}>
          <SymbolView
            name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
            tintColor={theme.text}
            size={20}
          />
        </Pressable>
        <ThemedText type="smallBold" style={styles.title}>
          목적지 구간
        </ThemedText>
        <View style={styles.iconButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Pressable
          onPress={() => router.push('/trip/country')}
          style={({ pressed }) => [
            styles.addButton,
            { backgroundColor: theme.primarySoft },
            pressed && styles.pressed,
          ]}>
          <ThemedText type="smallBold" themeColor="primary">
            구간 추가하기
          </ThemedText>
        </Pressable>

        {trip?.destinations.map((destination) => (
          <DestinationRow
            key={destination.id}
            countryFlag={destination.countryFlag}
            countryNameKo={destination.countryNameKo}
            startDate={destination.startDate}
            endDate={destination.endDate}
            onRemove={
              trip.destinations.length > 1 ? () => handleRemove(destination.id) : undefined
            }
          />
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  content: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  addButton: {
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
});
