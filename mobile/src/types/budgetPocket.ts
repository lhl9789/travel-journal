import { CurrencyCode } from './currency'

export interface BudgetPocket {
  id: string
  /** 여행당 1개 (1:1) */
  tripId: string
  /** 포켓 이름 (여행 생성 시 여행 이름으로 자동 설정, 이후 수정 가능) */
  name: string
  createdAt: string
}
/**
 * 포켓 삭제는 연동된 Expense가 0건일 때만 가능 (있으면 지출을 모두 삭제한 뒤 삭제),
 * 삭제 시 BudgetPocketTopUp도 함께 삭제됨
 */

export interface BudgetPocketTopUp {
  id: string
  pocketId: string
  paymentMethod: 'cash' | 'card'
  /** 충전 통화 (포켓 하나에 여러 통화 보유 가능) */
  currency: CurrencyCode
  /** 충전액 (해당 통화 기준) */
  amount: number
  /** 환전에 사용한 자국화폐 금액 */
  homeAmount: number
  date: string
  createdAt: string
}

/**
 * (통화, 결제수단) 조합별 집계 (저장값 아님, 충전 이력에서 동적 계산)
 *   충전액 합계 = sum(amount)
 *   평균환율 = sum(homeAmount) / sum(amount)
 *
 * 지출액/남은액((통화, 결제수단) 기준)은 expenses.pocketId + paymentMethod + currency 기준으로
 * 포켓 차감액(개인예산: amount, 공동예산: amount / (trip.companions.length + 1))을 합산하여
 * 충전액 합계 대비 계산 (저장값 아님)
 *
 * 자국화폐 기준 보조 정보(저장값 아님, 화면에서 계산)
 *   환전총액(자국화폐) = 해당 조합 충전 이력의 sum(homeAmount)
 *   사용액(자국화폐) = 포켓 차감액 합계 * 평균환율
 *   남은액(자국화폐) = 환전총액(자국화폐) - 사용액(자국화폐)
 */
