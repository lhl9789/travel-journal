import { NativeTabs } from 'expo-router/unstable-native-tabs'
import { useColorScheme } from 'react-native'

import { Colors } from '@/constants/theme'

interface TripTabsProps {
  tripId: string
}

/** 여행 상세 4탭: 프로필 / 예산 / 지출내역 / 통계 */
export default function TripTabs({ tripId: _tripId }: TripTabsProps) {
  const scheme = useColorScheme()
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme ?? 'light']

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.text } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>프로필</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="person.crop.circle" md="account_circle" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="budget">
        <NativeTabs.Trigger.Label>예산</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="wallet.pass" md="wallet" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="expenses">
        <NativeTabs.Trigger.Label>지출내역</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="list.bullet" md="receipt_long" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="stats">
        <NativeTabs.Trigger.Label>통계</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="chart.pie" md="pie_chart" />
      </NativeTabs.Trigger>
    </NativeTabs>
  )
}
