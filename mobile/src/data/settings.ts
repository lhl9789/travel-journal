import AsyncStorage from '@react-native-async-storage/async-storage'

import { AppSettings } from '@/types'

const SETTINGS_STORAGE_KEY = 'app-settings'

export const DEFAULT_SETTINGS: AppSettings = {
  homeCurrency: 'KRW',
  defaultPaymentMethod: 'cash',
  viewMode: 'list',
}

export async function getSettings(): Promise<AppSettings> {
  const raw = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY)
  if (!raw) {
    return DEFAULT_SETTINGS
  }

  return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<AppSettings>) }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
}
