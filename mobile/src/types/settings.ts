import { CurrencyCode } from './currency'
import { PaymentMethod } from './expense'

export interface AppSettings {
  homeCurrency: CurrencyCode
  defaultPaymentMethod: PaymentMethod
  exchangeRateOverrides?: Partial<Record<CurrencyCode, number>>
  viewMode: 'list' | 'grid'
}
