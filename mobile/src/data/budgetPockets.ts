import { type SQLiteDatabase } from 'expo-sqlite'

import { BudgetPocket } from '@/types'

interface BudgetPocketRow {
  id: string
  trip_id: string
  name: string
  created_at: string
}

function mapRow(row: BudgetPocketRow): BudgetPocket {
  return { id: row.id, tripId: row.trip_id, name: row.name, createdAt: row.created_at }
}

export async function getPocketByTripId(
  db: SQLiteDatabase,
  tripId: string,
): Promise<BudgetPocket | null> {
  const row = await db.getFirstAsync<BudgetPocketRow>(
    'SELECT * FROM budget_pockets WHERE trip_id = ?',
    tripId,
  )
  return row ? mapRow(row) : null
}

export async function renamePocket(db: SQLiteDatabase, pocketId: string, name: string): Promise<void> {
  await db.runAsync('UPDATE budget_pockets SET name = ? WHERE id = ?', name, pocketId)
}
