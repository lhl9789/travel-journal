import { type SQLiteDatabase } from 'expo-sqlite'

import { DEFAULT_CATEGORIES } from '@/constants/categories'

export const DATABASE_NAME = 'travelpocket.db'

const DATABASE_VERSION = 1

/**
 * PRAGMA user_version 기반 마이그레이션.
 * SQLiteProvider의 onInit으로 전달되어 앱 시작 시 1회 실행된다.
 */
export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const { user_version: currentVersion } = (await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version',
  )) ?? { user_version: 0 }

  if (currentVersion >= DATABASE_VERSION) {
    return
  }

  if (currentVersion < 1) {
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';

      CREATE TABLE IF NOT EXISTS trips (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        currency TEXT NOT NULL,
        cover_image TEXT,
        notes TEXT,
        companions TEXT NOT NULL DEFAULT '[]',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS trip_destinations (
        id TEXT PRIMARY KEY NOT NULL,
        trip_id TEXT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
        country_code TEXT NOT NULL,
        country_flag TEXT NOT NULL,
        country_name_ko TEXT NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        order_index INTEGER NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS budget_pockets (
        id TEXT PRIMARY KEY NOT NULL,
        trip_id TEXT NOT NULL UNIQUE REFERENCES trips(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS budget_pocket_topups (
        id TEXT PRIMARY KEY NOT NULL,
        pocket_id TEXT NOT NULL REFERENCES budget_pockets(id) ON DELETE CASCADE,
        payment_method TEXT NOT NULL,
        currency TEXT NOT NULL,
        amount REAL NOT NULL,
        home_amount REAL NOT NULL,
        date TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY NOT NULL,
        label TEXT NOT NULL,
        icon TEXT NOT NULL,
        order_index INTEGER NOT NULL,
        is_default INTEGER NOT NULL DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY NOT NULL,
        trip_id TEXT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
        type TEXT NOT NULL,
        payment_method TEXT NOT NULL,
        category_id TEXT NOT NULL REFERENCES categories(id),
        name TEXT,
        budget_source TEXT NOT NULL,
        amount REAL NOT NULL,
        currency TEXT NOT NULL,
        date TEXT NOT NULL,
        is_pre_trip INTEGER NOT NULL DEFAULT 0,
        notes TEXT,
        pocket_id TEXT NOT NULL REFERENCES budget_pockets(id) ON DELETE CASCADE,
        created_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_trip_destinations_trip_id ON trip_destinations(trip_id);
      CREATE INDEX IF NOT EXISTS idx_budget_pocket_topups_pocket_id ON budget_pocket_topups(pocket_id);
      CREATE INDEX IF NOT EXISTS idx_expenses_trip_id ON expenses(trip_id);
      CREATE INDEX IF NOT EXISTS idx_expenses_pocket_id ON expenses(pocket_id);
    `)

    await seedDefaultCategories(db)
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`)
}

async function seedDefaultCategories(db: SQLiteDatabase) {
  await db.withTransactionAsync(async () => {
    for (const category of DEFAULT_CATEGORIES) {
      await db.runAsync(
        'INSERT OR IGNORE INTO categories (id, label, icon, order_index, is_default) VALUES (?, ?, ?, ?, ?)',
        category.id,
        category.label,
        category.icon,
        category.orderIndex,
        category.isDefault ? 1 : 0,
      )
    }
  })
}
