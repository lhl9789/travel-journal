import { useFocusEffect, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TripCard } from '@/components/trip/trip-card';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { listTrips, TripWithDestinations } from '@/data/trips';
import { useTheme } from '@/hooks/use-theme';

export default function HomeScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [trips, setTrips] = useState<TripWithDestinations[]>([]);

  useFocusEffect(
    useCallback(() => {
      listTrips(db).then(setTrips);
    }, [db]),
  );

  const bottomPadding = insets.bottom + BottomTabInset + Spacing.three;

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        <View style={[styles.content, { paddingTop: insets.top + Spacing.three }]}>
          <ThemedText style={styles.heading}>
            여행 <ThemedText themeColor="textSecondary" style={styles.heading}>{trips.length}</ThemedText>
          </ThemedText>

          {trips.length === 0 ? (
            <EmptyState />
          ) : (
            <View style={styles.list}>
              <ThemedText type="smallBold" themeColor="textSecondary">
                다가오는 여행 {trips.length}
              </ThemedText>
              {trips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: bottomPadding }]}>
        <View style={styles.footerContent}>
          <Pressable
            onPress={() => router.push('/trip/new')}
            style={({ pressed }) => [
              styles.cta,
              { backgroundColor: theme.primary },
              pressed && styles.pressed,
            ]}>
            <SymbolView
              name={{ ios: 'airplane', android: 'flight', web: 'flight' }}
              tintColor={theme.onPrimary}
              size={18}
            />
            <ThemedText type="smallBold" themeColor="onPrimary">
              새로운 여행 만들기
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </ThemedView>
  );
}

function EmptyState() {
  const theme = useTheme();

  return (
    <View style={styles.emptyState}>
      <SymbolView
        name={{ ios: 'airplane', android: 'flight_takeoff', web: 'flight_takeoff' }}
        tintColor={theme.primary}
        size={48}
      />
      <ThemedText style={styles.emptyTitle}>첫 번째 여행을 시작해 보세요!</ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={styles.emptySubtitle}>
        지출을 손쉽게 기록하고 관리할 수 있어요
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
  },
  list: {
    gap: Spacing.three,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.six,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptySubtitle: {
    textAlign: 'center',
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
  },
  footerContent: {
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    borderRadius: Spacing.five,
    paddingVertical: Spacing.three,
  },
  pressed: {
    opacity: 0.8,
  },
});
