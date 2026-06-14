import { CurrencyCode } from '@/types'

/**
 * 국가 선택 화면에서 사용하는 주요 여행지 목록
 * 검색은 nameKo/code 부분일치로 수행
 */
export interface CountryInfo {
  code: string
  flag: string
  nameKo: string
  currency: CurrencyCode
}

export const COUNTRIES: CountryInfo[] = [
  { code: 'KR', flag: '🇰🇷', nameKo: '대한민국', currency: 'KRW' },
  { code: 'US', flag: '🇺🇸', nameKo: '미국', currency: 'USD' },
  { code: 'JP', flag: '🇯🇵', nameKo: '일본', currency: 'JPY' },
  { code: 'CN', flag: '🇨🇳', nameKo: '중국 본토', currency: 'CNY' },
  { code: 'SG', flag: '🇸🇬', nameKo: '싱가포르', currency: 'SGD' },
  { code: 'TH', flag: '🇹🇭', nameKo: '태국', currency: 'THB' },
  { code: 'VN', flag: '🇻🇳', nameKo: '베트남', currency: 'VND' },
  { code: 'HK', flag: '🇭🇰', nameKo: '홍콩', currency: 'HKD' },
  { code: 'TW', flag: '🇹🇼', nameKo: '대만', currency: 'TWD' },
  { code: 'GB', flag: '🇬🇧', nameKo: '영국', currency: 'GBP' },
  { code: 'AU', flag: '🇦🇺', nameKo: '오스트레일리아', currency: 'AUD' },
  { code: 'PH', flag: '🇵🇭', nameKo: '필리핀', currency: 'PHP' },
  { code: 'MY', flag: '🇲🇾', nameKo: '말레이시아', currency: 'MYR' },
  { code: 'ID', flag: '🇮🇩', nameKo: '인도네시아', currency: 'IDR' },
  { code: 'FR', flag: '🇫🇷', nameKo: '프랑스', currency: 'EUR' },
  { code: 'DE', flag: '🇩🇪', nameKo: '독일', currency: 'EUR' },
  { code: 'IT', flag: '🇮🇹', nameKo: '이탈리아', currency: 'EUR' },
  { code: 'ES', flag: '🇪🇸', nameKo: '스페인', currency: 'EUR' },
  { code: 'NL', flag: '🇳🇱', nameKo: '네덜란드', currency: 'EUR' },
  { code: 'PT', flag: '🇵🇹', nameKo: '포르투갈', currency: 'EUR' },
  { code: 'GR', flag: '🇬🇷', nameKo: '그리스', currency: 'EUR' },
  { code: 'AT', flag: '🇦🇹', nameKo: '오스트리아', currency: 'EUR' },
  { code: 'BE', flag: '🇧🇪', nameKo: '벨기에', currency: 'EUR' },
  { code: 'FI', flag: '🇫🇮', nameKo: '핀란드', currency: 'EUR' },
  { code: 'IE', flag: '🇮🇪', nameKo: '아일랜드', currency: 'EUR' },
  { code: 'LU', flag: '🇱🇺', nameKo: '룩셈부르크', currency: 'EUR' },
  { code: 'GU', flag: '🇬🇺', nameKo: '괌', currency: 'USD' },
  { code: 'KH', flag: '🇰🇭', nameKo: '캄보디아', currency: 'USD' },
  { code: 'MV', flag: '🇲🇻', nameKo: '몰디브', currency: 'USD' },
  { code: 'MO', flag: '🇲🇴', nameKo: '마카오', currency: 'HKD' },
]

export function searchCountries(query: string): CountryInfo[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) {
    return COUNTRIES
  }

  return COUNTRIES.filter(
    (country) =>
      country.nameKo.toLowerCase().includes(normalized) ||
      country.code.toLowerCase().includes(normalized),
  )
}
