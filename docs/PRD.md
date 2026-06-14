# PRD: TravelPocket Mobile (React Native / Expo)

## 1. 프로젝트 개요

| 항목 | 내용 |
|---|---|
| **프로젝트명** | TravelPocket Mobile |
| **목적** | 여행 중 지출/예산/통계를 기록·관리하는 iOS 앱 |
| **참조 앱** | 트라비포켓 (Trabee Pocket) — UI/UX 구조 벤치마킹 |
| **플랫폼** | React Native + Expo (Expo Router), `mobile/` 디렉토리 |
| **데이터 저장** | 로컬 전용 (expo-sqlite + AsyncStorage), 인증/서버 없음 |
| **타겟 사용자** | 해외/국내 여행을 자주 다니는 개인 |

---

## 2. 문제 정의

- 여행 중 지출이 어디에 얼마나 쓰였는지 파악하기 어렵다
- 예산을 초과하는지 실시간으로 확인하기 어렵다
- 외화 지출을 자국 화폐로 환산하는 과정이 번거롭다
- 카테고리/통화/결제수단 등 개인 선호에 맞춘 커스터마이징이 필요하다

---

## 3. 핵심 기능 (MVP)

### 3.1 여행 관리
- 여행 생성: "새로운 여행 만들기" → 목적지 선택 바텀시트("어디로 떠나세요?")에서 기간별 목적지(구간)를 추가
  - "여행 국가 추가하기" → 국가 선택 화면(국가명/국가 코드 검색, 국기 이모지 + 한글 국가명 + 국가 코드 목록)에서 국가 선택 → 해당 구간의 기간(시작일~종료일) 입력 → 목적지 목록에 추가
  - 구간은 여러 개 추가 가능 (예: 6/1~6/10 싱가포르, 6/10~6/20 홍콩), 각 구간은 X로 제거 가능
  - "완료" 시 여행 생성. 전체 여행 기간은 모든 구간의 최소 시작일~최대 종료일로 계산. 표시 통화는 첫 구간의 통화로 자동 설정됨
  - 커버 이미지 / 메모 입력
- 목적지 구간은 생성 이후에도 추가/삭제/수정(국가, 기간) 가능 (프로필 탭에서 편집) — 여행 일정은 언제든 바뀔 수 있음
- 여행 목록(홈) — 빈 상태 / 다가오는 여행 카드 (첫 구간 국기 + 국가명 + 전체 기간 표시, 구간이 여럿이면 추가 목적지 수 표기)
- 여행 상세 4탭: 프로필 / 예산 / 지출내역 / 통계
- 여행 제목 편집, 통화 설정(기본 표시 통화 수동 변경), 삭제 ("..." 메뉴)
- 여행 인원 관리: 동행자 이름 목록을 입력 (프로필 탭 "멤버"에서 편집). 여행 인원수(본인 포함)는 항상 "동행자 수 + 1"과 일치

### 3.2 지출 기록
- 포켓에 충전 이력이 하나도 없는 경우, 지출 입력 전에 포켓 최초 충전(통화·현금/카드·자국화폐 금액 입력)을 먼저 진행하도록 안내
- 카테고리별 지출 입력: 식비 / 쇼핑 / 교통 / 관광 / 숙박 / 미분류 (+커스텀)
- 항목명(메모성 이름) 입력 — 선택
- 현금/카드 구분, 지출/수입/환급 타입
- 지출 통화 선택: 포켓에 충전 이력이 있는 통화 중에서 선택. 기본값은 오늘 날짜가 포함된 목적지 구간의 통화 (해당 통화의 충전 이력이 없으면 여행의 기본 표시 통화, 그마저 충전 이력이 없으면 충전 이력이 있는 통화 중 가장 최근에 충전된 통화)
- 공동예산/개인예산 구분 입력
  - 개인예산: 지출 금액 전체가 연동 포켓 잔액에서 차감
  - 공동예산: 지출 금액을 여행 인원수(동행자 수 + 1)로 N등분하여 "내 분담금"만 연동 포켓 잔액에서 차감 (소수점 첫째 자리에서 반올림, 포켓은 개인 예산을 관리)
  - 지출내역에서 공동예산 지출은 전체 금액과 내 분담금을 함께 표시
- 지출은 예산 포켓에 연동되며, 입력한 (통화, 결제수단) 잔액에서 (개인예산은 전체 금액, 공동예산은 내 분담금이) 차감된다 (수입/환급 타입은 반대로 잔액에 더해짐)
- 포켓의 해당 (통화, 결제수단) 잔액이 부족할 경우, 지출 입력 화면 내에서 포켓 충전(충전액 + 환전에 사용한 자국화폐 금액 입력)을 먼저 진행한 뒤 이어서 지출을 입력할 수 있다
- 지출 금액은 입력한 통화 기준으로 표시하며, 연동된 포켓의 해당 (통화, 결제수단) 평균환율을 기준으로 환산한 자국화폐 금액을 보조 정보로 함께 표시 (예: "100 SGD (₩98,000)")
- 날짜별 지출내역 조회 (모든날/준비/요일별 탭), 현금·카드 필터, 정렬
- 지출 수정/삭제

### 3.3 예산 포켓
- 여행 생성 시 예산 포켓이 자동으로 함께 생성됨 (기본 이름: 여행 이름, 이후 이름 수정 가능)
- 여행별 예산 포켓은 1개만 관리
  - 포켓 삭제: 연동된 지출이 1건이라도 있으면 삭제 불가 → 지출내역을 모두 삭제한 뒤에만 포켓 삭제 가능 (삭제 시 충전 이력도 함께 삭제됨)
- 포켓에 자금 충전 (여러 번, 여러 통화 가능): **현금/카드** 구분 + **충전 통화** + 충전액과 함께 **환전에 사용한 자국화폐 금액**을 입력
- 충전 이력 목록 조회, 각 항목 수정/삭제 가능 (수정/삭제 시 해당 통화·결제수단의 평균환율 자동 재계산)
- 포켓의 (통화, 결제수단)별 평균환율은 해당 조합의 충전 이력 전체(자국화폐 합계 ÷ 충전액 합계)를 기준으로 자동 계산·갱신됨
- 포켓에 연동된 지출을 (통화, 결제수단)별로 합산 → 각 조합의 충전액·지출액·남은액 표시 (해당 통화 기준)
- (통화, 결제수단) 조합별로 **자국화폐 기준 보조 정보** 추가 표시
  - 환전총액(자국화폐) = 해당 조합 충전 이력의 자국화폐 합계
  - 사용액(자국화폐) = 해당 조합 포켓 차감액 합계 × 평균환율
  - 남은액(자국화폐) = 환전총액(자국화폐) − 사용액(자국화폐)

### 3.4 통계
- 카테고리별 지출 비율 (도넛 차트)
- 일별 지출 추이 (바 차트)
- 통화별 지출 현황

### 3.5 설정 (일반)
- 카테고리 설정: 카테고리 추가/수정/삭제/순서 변경
- 자국 화폐 설정: 모든 환산 기준이 되는 Home Currency (기본 KRW)
- 기본 결제 수단: 지출 입력 시 기본값 (현금/카드)
- 환율: 통화별 자국화폐 환산 환율 조회 + 수동 오버라이드

---

## 4. 사용자 흐름

```
[홈 — 여행 목록]
  ↓ "새로운 여행 만들기"
[목적지 선택 바텀시트 — "어디로 떠나세요?"]
  ↓ "여행 국가 추가하기" (구간별로 반복 추가 가능)
[국가 선택 화면 — 검색(국가명/국가코드) + 국기·국가명·코드 목록]
  ↓ 국가 선택 → 구간 기간(시작일~종료일) 입력 → 목적지 목록에 추가 (X로 제거, 추가 구간 반복)
  ↓ "완료"
[여행 상세]
  ├── 프로필 탭: 커버/기간/메모/멤버(동행자)/목적지 구간(추가·삭제·수정), "..." 메뉴(제목편집/통화/통계재계산/삭제)
  ├── 예산 탭: 예산 포켓(1개) 생성·이름 수정 (지출 0건일 때만 삭제 가능), 충전(통화·현금/카드·자국화폐 입력)/충전 이력 조회·수정·삭제
  ├── 지출내역 탭: 날짜별 조회 → FAB → (충전 이력 없으면 최초 충전 화면으로 안내) → 지출 입력(바텀시트, 키패드, 통화 선택, 포켓 잔액 부족 시 충전 유도)
  └── 통계 탭: 카테고리 도넛 + 일별 바차트 + 통화별 합계

[홈 우상단 아바타]
  ↓
[설정] → 카테고리 설정 / 자국 화폐 설정 / 기본 결제 수단 / 환율
```

---

## 5. 기술 아키텍처

### 5.1 기술 스택

| 레이어 | 기술 |
|---|---|
| **프레임워크** | Expo (React Native), Expo Router |
| **언어** | TypeScript |
| **로컬 DB** | expo-sqlite (async API) |
| **설정 저장** | @react-native-async-storage/async-storage |
| **바텀시트** | @gorhom/bottom-sheet |
| **차트** | react-native-gifted-charts (+ react-native-svg) |
| **날짜** | date-fns |
| **아이콘** | @expo/vector-icons (Ionicons) |
| **이미지** | expo-image-picker, expo-file-system |

### 5.2 디렉토리 구조

```
mobile/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx                         # 홈 (여행 목록)
│   ├── trip/
│   │   ├── new.tsx                       # 여행 생성 바텀시트 (목적지 구간 목록 관리)
│   │   ├── country.tsx                   # 국가 선택 화면 (구간별 국가 선택)
│   │   └── [tripId]/
│   │       ├── _layout.tsx               # 4탭 + 공통 헤더
│   │       ├── index.tsx                 # 프로필 탭 (커버/기간/메모/멤버 인라인 편집)
│   │       ├── destinations.tsx          # 목적지 구간 추가/수정/삭제 (국가 선택은 country.tsx 재사용)
│   │       ├── budget.tsx                # 예산 탭 (포켓 + 충전 이력)
│   │       ├── budget/
│   │       │   └── topup/
│   │       │       ├── new.tsx           # 충전 입력 바텀시트
│   │       │       └── [topUpId].tsx     # 충전 이력 수정
│   │       ├── expenses.tsx              # 지출내역 탭
│   │       ├── stats.tsx                 # 통계 탭
│   │       ├── menu.tsx                  # "..." 메뉴 시트
│   │       ├── edit-title.tsx
│   │       ├── currency-settings.tsx
│   │       └── expense/
│   │           ├── new.tsx
│   │           └── [expenseId].tsx
│   └── settings/
│       ├── index.tsx
│       ├── categories.tsx
│       ├── home-currency.tsx
│       ├── default-payment.tsx
│       └── exchange-rates.tsx
│
├── src/
│   ├── components/{ui,trip,expense,budget,stats,settings}/
│   ├── data/ (db.ts, trips.ts, tripDestinations.ts, expenses.ts, budgetPockets.ts, budgetPocketTopUps.ts, categories.ts, settings.ts)
│   ├── types/ (trip.ts, tripDestination.ts, expense.ts, budgetPocket.ts, category.ts, currency.ts, settings.ts)
│   ├── theme/ (colors.ts, spacing.ts, typography.ts)
│   ├── constants/ (categories.ts, countries.ts, currencies.ts)
│   ├── hooks/
│   └── utils/
```

### 5.3 데이터 모델

```ts
interface Trip {
  id: string
  name: string
  startDate: string   // 전체 여행 기간 시작 (목적지 구간들의 최소 startDate, 자동 계산)
  endDate: string     // 전체 여행 기간 종료 (목적지 구간들의 최대 endDate, 자동 계산)
  currency: CurrencyCode  // 기본 표시 통화. 생성 시 첫 구간 통화로 자동 설정, "..." 메뉴에서 수동 변경 가능
  coverImage?: string
  notes?: string
  companions: string[]    // 동행자 이름 목록 (본인 제외)
  createdAt: string
  updatedAt: string
}
// travelerCount(여행 인원수, 본인 포함) = companions.length + 1 (저장값 아님, 항상 companions와 일치)
//
// 지출/충전 입력 시 통화 선택의 기본 추천값(저장값 아님)
//   = 오늘 날짜가 포함된 TripDestination의 통화
//     (해당 통화의 충전 이력이 없으면 currency(기본 표시 통화),
//      그마저 충전 이력이 없으면 충전 이력이 있는 통화 중 가장 최근에 충전된 통화)

interface TripDestination {
  id: string
  tripId: string
  countryCode: string
  countryFlag: string
  countryNameKo: string
  startDate: string
  endDate: string
  orderIndex: number   // 구간 순서
  createdAt: string
}

interface Expense {
  id: string
  tripId: string
  type: "expense" | "income" | "refund"
  paymentMethod: "cash" | "card"
  categoryId: string
  name?: string           // 항목명 (선택)
  budgetSource: "personal" | "shared"  // 개인예산 / 공동예산
  amount: number          // 지출 통화 기준, 실제 지출 전체 금액
  currency: CurrencyCode  // 지출 통화 (포켓의 충전 이력에 존재하는 통화 중 선택)
  date: string
  isPreTrip: boolean
  notes?: string
  pocketId: string        // 연동된 예산 포켓 (여행당 1개)
  createdAt: string
}
// 포켓 차감액(저장값 아님, 화면/로직에서 계산)
//   = budgetSource === "shared" ? round(amount / (trip.companions.length + 1), 소수점 1자리) : amount  ("내 분담금")
//
// 자국화폐 환산액(화면 표시용, 저장값 아님)
//   = 포켓 차감액 * 평균환율(currency, paymentMethod)
//   → 포켓에 새 충전/수정/삭제가 발생해 평균환율이 바뀌면 과거 지출의 환산액도 함께 갱신됨

interface BudgetPocket {
  id: string
  tripId: string   // 여행당 1개 (1:1)
  name: string     // 포켓 이름 (여행 생성 시 여행 이름으로 자동 설정, 이후 수정 가능)
  createdAt: string
}
// 포켓 삭제는 연동된 Expense가 0건일 때만 가능 (있으면 지출을 모두 삭제한 뒤 삭제), 삭제 시 BudgetPocketTopUp도 함께 삭제됨

interface BudgetPocketTopUp {
  id: string
  pocketId: string
  paymentMethod: "cash" | "card"
  currency: CurrencyCode  // 충전 통화 (포켓 하나에 여러 통화 보유 가능)
  amount: number      // 충전액 (해당 통화 기준)
  homeAmount: number  // 환전에 사용한 자국화폐 금액
  date: string
  createdAt: string
}
// (통화, 결제수단) 조합별 집계 (저장값 아님, 충전 이력에서 동적 계산)
//   충전액 합계 = sum(amount)
//   평균환율 = sum(homeAmount) / sum(amount)
//
// 지출액/남은액((통화, 결제수단) 기준)은 expenses.pocketId + paymentMethod + currency 기준으로
// 포켓 차감액(개인예산: amount, 공동예산: amount / (trip.companions.length + 1))을 합산하여
// 충전액 합계 대비 계산 (저장값 아님)
//
// 자국화폐 기준 보조 정보(저장값 아님, 화면에서 계산)
//   환전총액(자국화폐) = 해당 조합 충전 이력의 sum(homeAmount)
//   사용액(자국화폐) = 포켓 차감액 합계 * 평균환율
//   남은액(자국화폐) = 환전총액(자국화폐) - 사용액(자국화폐)

interface Category {
  id: string
  label: string
  icon: string
  orderIndex: number
  isDefault: boolean
}

interface AppSettings {
  homeCurrency: CurrencyCode
  defaultPaymentMethod: "cash" | "card"
  exchangeRateOverrides?: Partial<Record<CurrencyCode, number>>
  viewMode: "list" | "grid"
}
```

### 5.4 환율 전략

- `constants/currencies.ts`에 자국화폐(기본 KRW) 대비 정적 환율 테이블 내장 → 오프라인 동작
- 설정 → 환율 화면에서 수동 오버라이드 가능 (`AppSettings.exchangeRateOverrides`)
- 포켓 충전 시, 정적 환율 테이블(+오버라이드)을 기준으로 자국화폐 금액 기본값을 제안하고 사용자가 실제 환전 영수증 기준으로 직접 수정 가능
- 포켓의 (통화, 결제수단)별 평균환율은 해당 조합의 충전 이력(`BudgetPocketTopUp`)으로부터 계산되며, 충전 추가/수정/삭제 시마다 재계산됨
- 지출의 자국화폐 환산액은 저장하지 않고 화면 표시 시점에 연동된 포켓의 (통화, 결제수단) 평균환율로 계산 (통계의 자국화폐 환산 지표도 동일 기준)

---

## 6. 구현 Phase 로드맵

| Phase | 내용 | 주요 파일 |
|---|---|---|
| **Phase 1** | 프로젝트 셋업, 테마, DB/마이그레이션(Trip/TripDestination/Expense/BudgetPocket/BudgetPocketTopUp/Category/Settings), 타입 | `app/_layout.tsx`, `src/data/db.ts`, `src/theme/`, `src/types/` |
| **Phase 2** | 홈 + 여행 CRUD (목적지 구간 추가/수정/삭제, 국가 선택, 동행자 입력) | `app/index.tsx`, `app/trip/new.tsx`, `app/trip/country.tsx`, `app/trip/[tripId]/index.tsx`, `destinations.tsx`, `menu.tsx` |
| **Phase 3** | 예산 포켓 (포켓 생성/이름수정/삭제, 충전 입력/수정/삭제, (통화,결제수단)별 평균환율·잔액 계산) — 지출 입력의 선행 의존성 | `app/trip/[tripId]/budget.tsx`, `budget/topup/new.tsx`, `budget/topup/[topUpId].tsx`, `BudgetPocketCard` |
| **Phase 4** | 지출내역 + 입력 (통화 선택, 개인/공동예산 N등분, 포켓 잔액 차감 및 충전 유도) | `app/trip/[tripId]/expenses.tsx`, `expense/new.tsx`, `ExpenseInputSheet` |
| **Phase 5** | 통계 (포켓 평균환율 기준 자국화폐 환산 포함) | `app/trip/[tripId]/stats.tsx`, `CategoryPieChart`, `DailyBarChart` |
| **Phase 6** | 설정 (카테고리/자국화폐/결제수단/환율) | `app/settings/*` |

---

## 7. 제외 범위 (향후 과제)

- 로그인/계정/비밀번호, 멤버 초대 실동작 (멀티유저 동기화)
- PDF/Excel/CSV 내보내기
- 지출 사진/위치 첨부
- 결제/구독 플랜
