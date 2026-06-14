import { useFocusEffect } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import { useCallback, useState } from 'react'

import { getTrip, TripWithDestinations } from '@/data/trips'

/**
 * 여행 상세 화면들에서 공용으로 사용하는 데이터 로더.
 * 화면이 포커스를 받을 때마다 trip + destinations를 다시 조회한다.
 */
export function useTrip(tripId: string) {
  const db = useSQLiteContext()
  const [trip, setTrip] = useState<TripWithDestinations | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const result = await getTrip(db, tripId)
    setTrip(result)
    setLoading(false)
  }, [db, tripId])

  useFocusEffect(
    useCallback(() => {
      refresh()
    }, [refresh]),
  )

  return { trip, loading, refresh }
}
