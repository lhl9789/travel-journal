import { useLocalSearchParams } from 'expo-router';

import TripTabs from '@/components/trip/trip-tabs';

export default function TripTabsLayout() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  return <TripTabs tripId={tripId} />;
}
