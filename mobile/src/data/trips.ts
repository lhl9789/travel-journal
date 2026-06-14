import { randomUUID } from 'expo-crypto'
import { type SQLiteDatabase } from 'expo-sqlite'

import { CurrencyCode, Trip, TripDestination } from '@/types'

interface TripRow {
  id: string
  name: string
  start_date: string
  end_date: string
  currency: string
  cover_image: string | null
  notes: string | null
  companions: string
  created_at: string
  updated_at: string
}

interface TripDestinationRow {
  id: string
  trip_id: string
  country_code: string
  country_flag: string
  country_name_ko: string
  start_date: string
  end_date: string
  order_index: number
  created_at: string
}

function mapTripRow(row: TripRow): Trip {
  return {
    id: row.id,
    name: row.name,
    startDate: row.start_date,
    endDate: row.end_date,
    currency: row.currency as CurrencyCode,
    coverImage: row.cover_image ?? undefined,
    notes: row.notes ?? undefined,
    companions: JSON.parse(row.companions) as string[],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapDestinationRow(row: TripDestinationRow): TripDestination {
  return {
    id: row.id,
    tripId: row.trip_id,
    countryCode: row.country_code,
    countryFlag: row.country_flag,
    countryNameKo: row.country_name_ko,
    startDate: row.start_date,
    endDate: row.end_date,
    orderIndex: row.order_index,
    createdAt: row.created_at,
  }
}

export interface TripWithDestinations extends Trip {
  destinations: TripDestination[]
}

export async function listTrips(db: SQLiteDatabase): Promise<TripWithDestinations[]> {
  const tripRows = await db.getAllAsync<TripRow>('SELECT * FROM trips ORDER BY start_date ASC')
  const destinationRows = await db.getAllAsync<TripDestinationRow>(
    'SELECT * FROM trip_destinations ORDER BY order_index ASC',
  )

  return tripRows.map((tripRow) => ({
    ...mapTripRow(tripRow),
    destinations: destinationRows.filter((row) => row.trip_id === tripRow.id).map(mapDestinationRow),
  }))
}

export async function getTrip(
  db: SQLiteDatabase,
  tripId: string,
): Promise<TripWithDestinations | null> {
  const tripRow = await db.getFirstAsync<TripRow>('SELECT * FROM trips WHERE id = ?', tripId)
  if (!tripRow) {
    return null
  }

  const destinationRows = await db.getAllAsync<TripDestinationRow>(
    'SELECT * FROM trip_destinations WHERE trip_id = ? ORDER BY order_index ASC',
    tripId,
  )

  return { ...mapTripRow(tripRow), destinations: destinationRows.map(mapDestinationRow) }
}

export interface NewDestinationInput {
  countryCode: string
  countryFlag: string
  countryNameKo: string
  startDate: string
  endDate: string
  currency: CurrencyCode
}

export interface CreateTripInput {
  destinations: NewDestinationInput[]
  coverImage?: string
  notes?: string
  companions?: string[]
}

function buildTripName(destinations: NewDestinationInput[]): string {
  return destinations.map((destination) => destination.countryNameKo).join(' · ')
}

/**
 * 트랜잭션 내에서 trip + 목적지 구간들을 생성하고,
 * PRD 3.3(예산 포켓 자동 생성) 에 따라 동일한 이름의 예산 포켓도 함께 생성한다.
 */
export async function createTrip(db: SQLiteDatabase, input: CreateTripInput): Promise<string> {
  const tripId = randomUUID()
  const now = new Date().toISOString()

  const startDate = input.destinations
    .map((destination) => destination.startDate)
    .reduce((min, date) => (date < min ? date : min))
  const endDate = input.destinations
    .map((destination) => destination.endDate)
    .reduce((max, date) => (date > max ? date : max))
  const currency = input.destinations[0].currency
  const name = buildTripName(input.destinations)

  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `INSERT INTO trips (id, name, start_date, end_date, currency, cover_image, notes, companions, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      tripId,
      name,
      startDate,
      endDate,
      currency,
      input.coverImage ?? null,
      input.notes ?? null,
      JSON.stringify(input.companions ?? []),
      now,
      now,
    )

    for (const [index, destination] of input.destinations.entries()) {
      await db.runAsync(
        `INSERT INTO trip_destinations (id, trip_id, country_code, country_flag, country_name_ko, start_date, end_date, order_index, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        randomUUID(),
        tripId,
        destination.countryCode,
        destination.countryFlag,
        destination.countryNameKo,
        destination.startDate,
        destination.endDate,
        index,
        now,
      )
    }

    await db.runAsync(
      `INSERT INTO budget_pockets (id, trip_id, name, created_at) VALUES (?, ?, ?, ?)`,
      randomUUID(),
      tripId,
      name,
      now,
    )
  })

  return tripId
}

export interface UpdateTripInput {
  name?: string
  currency?: CurrencyCode
  coverImage?: string | null
  notes?: string | null
  companions?: string[]
}

export async function updateTrip(
  db: SQLiteDatabase,
  tripId: string,
  patch: UpdateTripInput,
): Promise<void> {
  const current = await getTrip(db, tripId)
  if (!current) {
    return
  }

  const next = {
    name: patch.name ?? current.name,
    currency: patch.currency ?? current.currency,
    coverImage: patch.coverImage !== undefined ? patch.coverImage : current.coverImage ?? null,
    notes: patch.notes !== undefined ? patch.notes : current.notes ?? null,
    companions: patch.companions ?? current.companions,
  }

  await db.runAsync(
    `UPDATE trips SET name = ?, currency = ?, cover_image = ?, notes = ?, companions = ?, updated_at = ? WHERE id = ?`,
    next.name,
    next.currency,
    next.coverImage,
    next.notes,
    JSON.stringify(next.companions),
    new Date().toISOString(),
    tripId,
  )
}

export async function deleteTrip(db: SQLiteDatabase, tripId: string): Promise<void> {
  await db.runAsync('DELETE FROM trips WHERE id = ?', tripId)
}

/**
 * 목적지 구간이 추가/수정/삭제될 때마다 trip의 전체 여행 기간
 * (모든 구간의 최소 startDate ~ 최대 endDate)을 재계산해 반영한다.
 */
export async function recalculateTripDateRange(db: SQLiteDatabase, tripId: string): Promise<void> {
  const range = await db.getFirstAsync<{ min_start: string | null; max_end: string | null }>(
    'SELECT MIN(start_date) as min_start, MAX(end_date) as max_end FROM trip_destinations WHERE trip_id = ?',
    tripId,
  )
  if (!range?.min_start || !range.max_end) {
    return
  }

  await db.runAsync(
    'UPDATE trips SET start_date = ?, end_date = ?, updated_at = ? WHERE id = ?',
    range.min_start,
    range.max_end,
    new Date().toISOString(),
    tripId,
  )
}
