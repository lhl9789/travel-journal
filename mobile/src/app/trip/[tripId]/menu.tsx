import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CURRENCIES } from '@/constants/currencies';
import { Spacing } from '@/constants/theme';
import { deleteTrip, updateTrip } from '@/data/trips';
import { useTheme } from '@/hooks/use-theme';
import { useTrip } from '@/hooks/use-trip';
import { CurrencyCode } from '@/types';

/** 여행 "..." 메뉴 — 제목 편집 / 통화 변경 / 여행 삭제 (PRD 3.1) */
export default function TripMenuScreen() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const db = useSQLiteContext();
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { trip, refresh } = useTrip(tripId);

  const [nameDraft, setNameDraft] = useState<string | null>(null);

  if (!trip) {
    return <ThemedView style={styles.container} />;
  }

  const name = nameDraft ?? trip.name;

  const handleNameBlur = async () => {
    const trimmed = name.trim();
    if (!trimmed || trimmed === trip.name) {
      setNameDraft(null);
      return;
    }
    await updateTrip(db, tripId, { name: trimmed });
    setNameDraft(null);
    refresh();
  };

  const handleCurrencySelect = async (code: CurrencyCode) => {
    if (code === trip.currency) {
      return;
    }
    await updateTrip(db, tripId, { currency: code });
    refresh();
  };

  const handleDelete = () => {
    Alert.alert('여행 삭제', '이 여행과 관련된 모든 데이터가 삭제됩니다. 계속하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          await deleteTrip(db, tripId);
          router.replace('/');
        },
      },
    ]);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.handle, { backgroundColor: theme.border }]} />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.four }]}>
        <ThemedText style={styles.title}>여행 설정</ThemedText>

        <View style={styles.section}>
          <ThemedText type="small" themeColor="textSecondary">
            여행 이름
          </ThemedText>
          <TextInput
            value={name}
            onChangeText={setNameDraft}
            onBlur={handleNameBlur}
            placeholderTextColor={theme.textSecondary}
            style={[styles.nameInput, { color: theme.text, backgroundColor: theme.backgroundElement }]}
          />
        </View>

        <View style={styles.section}>
          <ThemedText type="small" themeColor="textSecondary">
            기본 통화
          </ThemedText>
          {CURRENCIES.map((currency) => (
            <Pressable
              key={currency.code}
              onPress={() => handleCurrencySelect(currency.code)}
              style={({ pressed }) => [
                styles.currencyRow,
                { backgroundColor: theme.backgroundElement },
                pressed && styles.pressed,
              ]}>
              <ThemedText type="smallBold" style={styles.currencySymbol}>
                {currency.symbol}
              </ThemedText>
              <ThemedText style={styles.currencyName}>{currency.nameKo}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {currency.code}
              </ThemedText>
              {currency.code === trip.currency && (
                <SymbolView
                  name={{ ios: 'checkmark', android: 'check', web: 'check' }}
                  tintColor={theme.primary}
                  size={18}
                />
              )}
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={handleDelete}
          style={({ pressed }) => [
            styles.deleteButton,
            { backgroundColor: theme.backgroundElement },
            pressed && styles.pressed,
          ]}>
          <SymbolView
            name={{ ios: 'trash', android: 'delete', web: 'delete' }}
            tintColor={theme.danger}
            size={18}
          />
          <ThemedText type="smallBold" themeColor="danger">
            여행 삭제
          </ThemedText>
        </Pressable>
      </ScrollView>
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
  nameInput: {
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 16,
  },
  currencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  currencySymbol: {
    width: 28,
  },
  currencyName: {
    flex: 1,
  },
  pressed: {
    opacity: 0.7,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
  },
});
