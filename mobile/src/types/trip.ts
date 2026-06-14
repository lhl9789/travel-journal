import { CurrencyCode } from './currency'

export interface Trip {
  id: string
  name: string
  /** 전체 여행 기간 시작 (목적지 구간들의 최소 startDate, 자동 계산) */
  startDate: string
  /** 전체 여행 기간 종료 (목적지 구간들의 최대 endDate, 자동 계산) */
  endDate: string
  /** 기본 표시 통화. 생성 시 첫 구간 통화로 자동 설정, "..." 메뉴에서 수동 변경 가능 */
  currency: CurrencyCode
  coverImage?: string
  notes?: string
  /** 동행자 이름 목록 (본인 제외) */
  companions: string[]
  createdAt: string
  updatedAt: string
}

/**
 * travelerCount(여행 인원수, 본인 포함) = trip.companions.length + 1 (저장값 아님, 항상 companions와 일치)
 *
 * 지출/충전 입력 시 통화 선택의 기본 추천값(저장값 아님)
 *   = 오늘 날짜가 포함된 TripDestination의 통화
 *     (해당 통화의 충전 이력이 없으면 currency(기본 표시 통화),
 *      그마저 충전 이력이 없으면 충전 이력이 있는 통화 중 가장 최근에 충전된 통화)
 */
