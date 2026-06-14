import { CurrencyCode } from '@/types'

/**
 * 국가 선택 화면(country.tsx)에서 작성한 목적지 구간 초안을 임시 보관하는 모듈 레벨 스토어.
 * country.tsx에서 setDraftDestination 후 router.back() 하면,
 * 호출한 화면이 포커스를 되찾을 때 takeDraftDestination으로 꺼내 목적지 목록에 반영한다.
 */
export interface DraftDestination {
  countryCode: string
  countryFlag: string
  countryNameKo: string
  currency: CurrencyCode
  startDate: string
  endDate: string
}

let draft: DraftDestination | null = null

export function setDraftDestination(destination: DraftDestination): void {
  draft = destination
}

export function takeDraftDestination(): DraftDestination | null {
  const current = draft
  draft = null
  return current
}
