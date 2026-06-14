import { Stack } from 'expo-router';

/** 여행 상세: 4탭(profile/budget/expenses/stats) + 구간 관리 + "..." 메뉴 */
export default function TripLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="destinations" />
      <Stack.Screen name="menu" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
