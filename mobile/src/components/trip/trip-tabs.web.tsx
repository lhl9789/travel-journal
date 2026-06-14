import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { SymbolView, SymbolViewProps } from 'expo-symbols';
import { Pressable, View, StyleSheet } from 'react-native';

import { ThemedText } from './../themed-text';
import { ThemedView } from './../themed-view';

import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface TripTabsProps {
  tripId: string;
}

const TABS: { name: string; href: (tripId: string) => string; icon: SymbolViewProps['name']; label: string }[] = [
  {
    name: 'index',
    href: (tripId) => `/trip/${tripId}`,
    icon: { ios: 'person.crop.circle', android: 'account_circle', web: 'account_circle' },
    label: '프로필',
  },
  {
    name: 'budget',
    href: (tripId) => `/trip/${tripId}/budget`,
    icon: { ios: 'wallet.pass', android: 'wallet', web: 'wallet' },
    label: '예산',
  },
  {
    name: 'expenses',
    href: (tripId) => `/trip/${tripId}/expenses`,
    icon: { ios: 'list.bullet', android: 'receipt_long', web: 'receipt_long' },
    label: '지출내역',
  },
  {
    name: 'stats',
    href: (tripId) => `/trip/${tripId}/stats`,
    icon: { ios: 'chart.pie', android: 'pie_chart', web: 'pie_chart' },
    label: '통계',
  },
];

/** 여행 상세 4탭 (web) — app-tabs.web.tsx 패턴을 따른다 */
export default function TripTabs({ tripId }: TripTabsProps) {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <TabBar>
          {TABS.map((tab) => (
            <TabTrigger key={tab.name} name={tab.name} href={tab.href(tripId)} asChild>
              <TabButton icon={tab.icon} label={tab.label} />
            </TabTrigger>
          ))}
        </TabBar>
      </TabList>
    </Tabs>
  );
}

function TabButton({
  icon,
  label,
  isFocused,
  ...props
}: TabTriggerSlotProps & { icon: SymbolViewProps['name']; label: string }) {
  const theme = useTheme();

  return (
    <Pressable {...props} style={({ pressed }) => [styles.tabButton, pressed && styles.pressed]}>
      <SymbolView name={icon} tintColor={isFocused ? theme.primary : theme.textSecondary} size={20} />
      <ThemedText type="small" themeColor={isFocused ? 'primary' : 'textSecondary'}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

function TabBar(props: TabListProps) {
  return (
    <View {...props} style={styles.tabListContainer}>
      <ThemedView type="backgroundElement" style={styles.innerContainer}>
        {props.children}
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    width: '100%',
    padding: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  innerContainer: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.five,
    borderRadius: Spacing.five,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexGrow: 1,
    gap: Spacing.two,
    maxWidth: MaxContentWidth,
  },
  pressed: {
    opacity: 0.7,
  },
  tabButton: {
    alignItems: 'center',
    gap: Spacing.half,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.three,
  },
});
