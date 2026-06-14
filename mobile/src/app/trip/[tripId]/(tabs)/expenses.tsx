import { useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TripHeader } from '@/components/trip/trip-header';
import { Spacing } from '@/constants/theme';
import { useTrip } from '@/hooks/use-trip';

/** 여행 상세 — 지출내역 탭 (Phase 4에서 구현) */
export default function TripExpensesScreen() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const { trip } = useTrip(tripId);

  return (
    <ThemedView style={styles.container}>
      <TripHeader title={trip?.name ?? ''} tripId={tripId} />
      <ThemedView style={styles.placeholder}>
        <ThemedText type="small" themeColor="textSecondary">
          지출내역은 Phase 4에서 구현됩니다
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
  },
});
