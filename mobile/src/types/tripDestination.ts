export interface TripDestination {
  id: string
  tripId: string
  countryCode: string
  countryFlag: string
  countryNameKo: string
  startDate: string
  endDate: string
  /** 구간 순서 */
  orderIndex: number
  createdAt: string
}
