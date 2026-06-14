import { CurrencyCode } from './currency'

export type ExpenseType = 'expense' | 'income' | 'refund'
export type PaymentMethod = 'cash' | 'card'
/** 개인예산 / 공동예산 */
export type BudgetSource = 'personal' | 'shared'

export interface Expense {
  id: string
  tripId: string
  type: ExpenseType
  paymentMethod: PaymentMethod
  categoryId: string
  /** 항목명 (선택) */
  name?: string
  budgetSource: BudgetSource
  /** 지출 통화 기준, 실제 지출 전체 금액 */
  amount: number
  /** 지출 통화 (포켓의 충전 이력에 존재하는 통화 중 선택) */
  currency: CurrencyCode
  date: string
  isPreTrip: boolean
  notes?: string
  /** 연동된 예산 포켓 (여행당 1개) */
  pocketId: string
  createdAt: string
}

/**
 * 포켓 차감액(저장값 아님, 화면/로직에서 계산)
 *   = budgetSource === "shared" ? round(amount / (trip.companions.length + 1), 소수점 1자리) : amount  ("내 분담금")
 *
 * 자국화폐 환산액(화면 표시용, 저장값 아님)
 *   = 포켓 차감액 * 평균환율(currency, paymentMethod)
 *   → 포켓에 새 충전/수정/삭제가 발생해 평균환율이 바뀌면 과거 지출의 환산액도 함께 갱신됨
 */
