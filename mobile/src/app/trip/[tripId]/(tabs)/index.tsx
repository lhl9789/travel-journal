import { format, parseISO } from 'date-fns';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CompanionList } from '@/components/trip/companion-list';
import { DestinationRow } from '@/components/trip/destination-row';
import { TripHeader } from '@/components/trip/trip-header';
import { Spacing } from '@/constants/theme';
import { updateTrip } from '@/data/trips';
import { useTheme } from '@/hooks/use-theme';
import { useTrip } from '@/hooks/use-trip';
import { pickCoverImage } from '@/utils/image-picker';

/** 여행 상세 — 프로필 탭 (커버/기간/메모/멤버/목적지 구간) */
export default function TripProfileScreen() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const db = useSQLiteContext();
  const router = useRouter();
  const theme = useTheme();
  const { trip, refresh } = useTrip(tripId);

  const [notesDraft, setNotesDraft] = useState<string | null>(null);

  if (!trip) {
    return <ThemedView style={styles.container} />;
  }

  const notes = notesDraft ?? trip.notes ?? '';

  const handlePickCover = async () => {
    const uri = await pickCoverImage();
    if (uri) {
      await updateTrip(db, tripId, { coverImage: uri });
      refresh();
    }
  };

  const handleNotesBlur = async () => {
    if (notesDraft === null || notesDraft.trim() === (trip.notes ?? '')) {
      return;
    }
    await updateTrip(db, tripId, { notes: notesDraft.trim() || null });
    refresh();
  };

  const handleCompanionsChange = async (companions: string[]) => {
    await updateTrip(db, tripId, { companions });
    refresh();
  };

  return (
    <ThemedView style={styles.container}>
      <TripHeader title={trip.name} tripId={tripId} />
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable
          onPress={handlePickCover}
          style={[styles.coverPicker, { backgroundColor: theme.backgroundElement }]}>
          {trip.coverImage ? (
            <Image source={{ uri: trip.coverImage }} style={styles.coverImage} />
          ) : (
            <SymbolView
              name={{ ios: 'photo', android: 'image', web: 'image' }}
              tintColor={theme.textSecondary}
              size={28}
            />
          )}
        </Pressable>

        <View style={styles.section}>
          <ThemedText type="small" themeColor="textSecondary">
            기간
          </ThemedText>
          <ThemedText>
            {format(parseISO(trip.startDate), 'yyyy.M.d')} - {format(parseISO(trip.endDate), 'yyyy.M.d')}
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="small" themeColor="textSecondary">
            메모
          </ThemedText>
          <TextInput
            value={notes}
            onChangeText={setNotesDraft}
            onBlur={handleNotesBlur}
            placeholder="여행에 대한 메모를 남겨보세요"
            placeholderTextColor={theme.textSecondary}
            multiline
            style={[styles.notesInput, { color: theme.text, backgroundColor: theme.backgroundElement }]}
          />
        </View>

        <View style={styles.section}>
          <ThemedText type="small" themeColor="textSecondary">
            여행 멤버
          </ThemedText>
          <CompanionList companions={trip.companions} onChange={handleCompanionsChange} />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="small" themeColor="textSecondary">
              목적지 구간
            </ThemedText>
            <Pressable onPress={() => router.push(`/trip/${tripId}/destinations`)} hitSlop={8}>
              <View style={styles.manageButton}>
                <ThemedText type="small" themeColor="primary">
                  구간 관리
                </ThemedText>
                <SymbolView
                  name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
                  tintColor={theme.primary}
                  size={14}
                />
              </View>
            </Pressable>
          </View>
          {trip.destinations.map((destination) => (
            <DestinationRow
              key={destination.id}
              countryFlag={destination.countryFlag}
              countryNameKo={destination.countryNameKo}
              startDate={destination.startDate}
              endDate={destination.endDate}
            />
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.four,
    gap: Spacing.five,
  },
  coverPicker: {
    height: 160,
    borderRadius: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  section: {
    gap: Spacing.two,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.half,
  },
  notesInput: {
    minHeight: 80,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    fontSize: 16,
    textAlignVertical: 'top',
  },
});
