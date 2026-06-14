import { isValid, parse } from 'date-fns';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { DateField } from '@/components/ui/date-field';
import { CountryInfo, searchCountries } from '@/constants/countries';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { setDraftDestination } from '@/utils/draft-destination';

/** 여행 국가/기간 선택 모달 (PRD 3.1) */
export default function CountryScreen() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<CountryInfo | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const results = useMemo(() => searchCountries(query), [query]);

  const isStartValid = isValid(parse(startDate, 'yyyy-MM-dd', new Date()));
  const isEndValid = isValid(parse(endDate, 'yyyy-MM-dd', new Date()));
  const canSubmit = isStartValid && isEndValid && startDate <= endDate;

  const handleSelect = (country: CountryInfo) => {
    setSelected(country);
  };

  const handleSubmit = () => {
    if (!selected || !canSubmit) {
      return;
    }

    setDraftDestination({
      countryCode: selected.code,
      countryFlag: selected.flag,
      countryNameKo: selected.nameKo,
      currency: selected.currency,
      startDate,
      endDate,
    });
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.handle, { backgroundColor: theme.border }]} />

      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerSide} />
        <ThemedText type="smallBold" style={styles.headerTitle}>
          {selected ? `${selected.flag} ${selected.nameKo}` : '국가 선택'}
        </ThemedText>
        <View style={styles.headerSide}>
          <Pressable onPress={() => (selected ? setSelected(null) : router.back())}>
            <ThemedText type="small" themeColor="primary" style={styles.headerAction}>
              {selected ? '다시 선택' : '닫기'}
            </ThemedText>
          </Pressable>
        </View>
      </View>

      {selected ? (
        <View style={styles.content}>
          <View style={styles.dateRow}>
            <DateField label="시작일" value={startDate} onChangeText={setStartDate} />
            <DateField label="종료일" value={endDate} onChangeText={setEndDate} />
          </View>
        </View>
      ) : (
        <>
          <View style={styles.searchBar}>
            <View style={[styles.searchInputWrapper, { backgroundColor: theme.backgroundElement }]}>
              <SymbolView
                name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
                tintColor={theme.textSecondary}
                size={18}
              />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="국가명 또는 코드 검색"
                placeholderTextColor={theme.textSecondary}
                style={[styles.searchInput, { color: theme.text }]}
              />
            </View>
          </View>

          <FlatList
            data={results}
            keyExtractor={(item) => item.code}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleSelect(item)}
                style={({ pressed }) => [styles.countryRow, pressed && styles.pressed]}>
                <ThemedText style={styles.countryFlag}>{item.flag}</ThemedText>
                <ThemedText style={styles.countryName}>{item.nameKo}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {item.code}
                </ThemedText>
              </Pressable>
            )}
          />
        </>
      )}

      {selected && (
        <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.three }]}>
          <Pressable
            onPress={handleSubmit}
            disabled={!canSubmit}
            style={({ pressed }) => [
              styles.primaryButton,
              {
                backgroundColor: theme.primary,
                opacity: !canSubmit ? 0.5 : pressed ? 0.8 : 1,
              },
            ]}>
            <ThemedText type="smallBold" themeColor="onPrimary">
              추가
            </ThemedText>
          </Pressable>
        </View>
      )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  headerSide: {
    minWidth: 56,
    alignItems: 'flex-end',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
  },
  headerAction: {
    paddingVertical: Spacing.one,
  },
  searchBar: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  list: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.three,
  },
  pressed: {
    opacity: 0.6,
  },
  countryFlag: {
    fontSize: 24,
  },
  countryName: {
    flex: 1,
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: Spacing.four,
    gap: Spacing.four,
  },
  dateRow: {
    gap: Spacing.three,
  },
  footer: {
    padding: Spacing.four,
  },
  primaryButton: {
    borderRadius: Spacing.five,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
});
