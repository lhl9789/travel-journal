/**
 * 여행지에서 자주 사용되는 통화 목록
 * exchangeRateToKrw: 1 단위당 KRW 환산 정적 환율 (설정 > 환율의 기본값으로 사용, 사용자가 오버라이드 가능)
 */
export const CURRENCIES = [
  { code: 'KRW', symbol: '₩', nameKo: '대한민국 원', exchangeRateToKrw: 1 },
  { code: 'USD', symbol: '$', nameKo: '미국 달러', exchangeRateToKrw: 1350 },
  { code: 'JPY', symbol: '¥', nameKo: '일본 엔', exchangeRateToKrw: 9.2 },
  { code: 'EUR', symbol: '€', nameKo: '유로', exchangeRateToKrw: 1470 },
  { code: 'CNY', symbol: '¥', nameKo: '중국 위안', exchangeRateToKrw: 187 },
  { code: 'SGD', symbol: 'S$', nameKo: '싱가포르 달러', exchangeRateToKrw: 1010 },
  { code: 'THB', symbol: '฿', nameKo: '태국 바트', exchangeRateToKrw: 39 },
  { code: 'VND', symbol: '₫', nameKo: '베트남 동', exchangeRateToKrw: 0.054 },
  { code: 'HKD', symbol: 'HK$', nameKo: '홍콩 달러', exchangeRateToKrw: 173 },
  { code: 'TWD', symbol: 'NT$', nameKo: '대만 달러', exchangeRateToKrw: 42 },
  { code: 'GBP', symbol: '£', nameKo: '영국 파운드', exchangeRateToKrw: 1720 },
  { code: 'AUD', symbol: 'A$', nameKo: '호주 달러', exchangeRateToKrw: 890 },
  { code: 'PHP', symbol: '₱', nameKo: '필리핀 페소', exchangeRateToKrw: 23 },
  { code: 'MYR', symbol: 'RM', nameKo: '말레이시아 링깃', exchangeRateToKrw: 300 },
  { code: 'IDR', symbol: 'Rp', nameKo: '인도네시아 루피아', exchangeRateToKrw: 0.085 },
] as const

export type CurrencyInfo = (typeof CURRENCIES)[number]
