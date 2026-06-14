import { CURRENCIES } from '@/constants/currencies'

export type CurrencyCode = (typeof CURRENCIES)[number]['code']
