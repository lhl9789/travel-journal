import { Image } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CompanionList } from '@/components/trip/companion-list';
import { DestinationRow } from '@/components/trip/destination-row';
import { Spacing } from '@/constants/theme';
import { createTrip } from '@/data/trips';
import { useTheme } from '@/hooks/use-theme';
import { DraftDestination, takeDraftDestination } from '@/utils/draft-destination';
import { pickCoverImage } from '@/utils/image-picker';

/** 여행 생성 바텀시트 — "어디로 떠나세요?" (PRD 3.1 / 4) */
export default function NewTripScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const [destinations, setDestinations] = useState<DraftDestination[]>([]);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [companions, setCompanions] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const draft = takeDraftDestination();
      if (draft) {
        setDestinations((prev) => [...prev, draft]);
      }
    }, []),
  );

  const handleRemove = (index: number) => {
    setDestinations((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePickCover = async () => {
    const uri = await pickCoverImage();
    if (uri) {
      setCoverImage(uri);
    }
  };

  const handleSubmit = async () => {
    if (destinations.length === 0 || submitting) {
      return;
    }

    setSubmitting(true);
    try {
      const tripId = await createTrip(db, {
        destinations,
        coverImage: coverImage ?? undefined,
        notes: notes.trim() || undefined,
        companions,
      });
      router.replace(`/trip/${tripId}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.handle, { backgroundColor: theme.border }]} />
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText style={styles.title}>어디로 떠나세요?</ThemedText>

        <View style={styles.section}>
          <Pressable
            onPress={() => router.push('/trip/country')}
            style={({ pressed }) => [
              styles.addCountryButton,
              { backgroundColor: theme.primarySoft },
              pressed && styles.pressed,
            ]}>
            <ThemedText type="smallBold" themeColor="primary">
              여행 국가 추가하기
            </ThemedText>
          </Pressable>

          {destinations.map((destination, index) => (
            <DestinationRow
              key={`${destination.countryCode}-${index}`}
              countryFlag={destination.countryFlag}
              countryNameKo={destination.countryNameKo}
              startDate={destination.startDate}
              endDate={destination.endDate}
              onRemove={() => handleRemove(index)}
            />
          ))}
        </View>

        <View style={styles.section}>
          <ThemedText type="small" themeColor="textSecondary">
            커버 이미지
          </ThemedText>
          <Pressable
            onPress={handlePickCover}
            style={[styles.coverPicker, { backgroundColor: theme.backgroundElement }]}>
            {coverImage ? (
              <Image source={{ uri: coverImage }} style={styles.coverImage} />
            ) : (
              <SymbolView
                name={{ ios: 'photo', android: 'image', web: 'image' }}
                tintColor={theme.textSecondary}
                size={28}
              />
            )}
          </Pressable>
        </View>

        <View style={styles.section}>
          <ThemedText type="small" themeColor="textSecondary">
            메모
          </ThemedText>
          <TextInput
            value={notes}
            onChangeText={setNotes}
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
          <CompanionList companions={companions} onChange={setCompanions} />
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.three }]}>
        <Pressable
          onPress={handleSubmit}
          disabled={destinations.length === 0 || submitting}
          style={({ pressed }) => [
            styles.primaryButton,
            {
              backgroundColor: theme.primary,
              opacity: destinations.length === 0 ? 0.5 : pressed ? 0.8 : 1,
            },
          ]}>
          <ThemedText type="smallBold" themeColor="onPrimary">
            완료
          </ThemedText>
        </Pressable>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.secondaryButton,
            { backgroundColor: theme.primarySoft },
            pressed && styles.pressed,
          ]}>
          <ThemedText type="smallBold" themeColor="primary">
            취소
          </ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    marginTop: Spacing.two,
  },
  content: {
    padding: Spacing.four,
    gap: Spacing.five,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  section: {
    gap: Spacing.two,
  },
  addCountryButton: {
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
  coverPicker: {
    height: 140,
    borderRadius: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  notesInput: {
    minHeight: 80,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  footer: {
    padding: Spacing.four,
    gap: Spacing.two,
  },
  primaryButton: {
    borderRadius: Spacing.five,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  secondaryButton: {
    borderRadius: Spacing.five,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
});
