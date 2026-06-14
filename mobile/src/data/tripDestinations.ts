import { randomUUID } from 'expo-crypto'
import { type SQLiteDatabase } from 'expo-sqlite'

import { recalculateTripDateRange } from './trips'

export interface DestinationInput {
  countryCode: string
  countryFlag: string
  countryNameKo: string
  startDate: string
  endDate: string
}

export async function addDestination(
  db: SQLiteDatabase,
  tripId: string,
  input: DestinationInput,
): Promise<void> {
  const orderRow = await db.getFirstAsync<{ max_order: number | null }>(
    'SELECT MAX(order_index) as max_order FROM trip_destinations WHERE trip_id = ?',
    tripId,
  )
  const nextOrder = (orderRow?.max_order ?? -1) + 1

  await db.runAsync(
    `INSERT INTO trip_destinations (id, trip_id, country_code, country_flag, country_name_ko, start_date, end_date, order_index, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    randomUUID(),
    tripId,
    input.countryCode,
    input.countryFlag,
    input.countryNameKo,
    input.startDate,
    input.endDate,
    nextOrder,
    new Date().toISOString(),
  )

  await recalculateTripDateRange(db, tripId)
}

export async function updateDestination(
  db: SQLiteDatabase,
  destinationId: string,
  input: DestinationInput,
): Promise<void> {
  const row = await db.getFirstAsync<{ trip_id: string }>(
    'SELECT trip_id FROM trip_destinations WHERE id = ?',
    destinationId,
  )
  if (!row) {
    return
  }

  await db.runAsync(
    `UPDATE trip_destinations SET country_code = ?, country_flag = ?, country_name_ko = ?, start_date = ?, end_date = ? WHERE id = ?`,
    input.countryCode,
    input.countryFlag,
    input.countryNameKo,
    input.startDate,
    input.endDate,
    destinationId,
  )

  await recalculateTripDateRange(db, row.trip_id)
}

export async function removeDestination(db: SQLiteDatabase, destinationId: string): Promise<void> {
  const row = await db.getFirstAsync<{ trip_id: string }>(
    'SELECT trip_id FROM trip_destinations WHERE id = ?',
    destinationId,
  )
  if (!row) {
    return
  }

  await db.runAsync('DELETE FROM trip_destinations WHERE id = ?', destinationId)
  await recalculateTripDateRange(db, row.trip_id)
}
