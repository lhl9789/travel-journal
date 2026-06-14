# Mobile Phase 1 설계 노트 — 프로젝트 셋업 (테마/DB/타입)

`docs/PRD.md` 6장 로드맵의 Phase 1 구현 결과를 정리한다. 대상 디렉토리: `mobile/src/types/`, `mobile/src/theme/`, `mobile/src/constants/`, `mobile/src/data/`, `mobile/src/app/_layout.tsx`.

## 1. 색상/타이포 토큰

루트의 참조 디자인 시안(`메인화면.png`, `여행세부_예산탭_메인화면.png`, `설정화면.png`)을 기준으로 `mobile/src/theme/colors.ts`에 다음 토큰을 정의했다.

| 토큰 | Light | Dark | 용도 |
|---|---|---|---|
| `text` | `#000000` | `#ffffff` | 본문 텍스트 |
| `textSecondary` | `#60646C` | `#B0B4BA` | 보조 텍스트 (설명, 캡션) |
| `background` | `#ffffff` | `#000000` | 화면 배경 |
| `backgroundElement` | `#F0F0F3` | `#212225` | 카드/입력 필드 배경 |
| `backgroundSelected` | `#E0E1E6` | `#2E3135` | 선택된 항목 배경 |
| `primary` | `#6C63FF` | `#8B85FF` | 포인트 컬러 — 플로팅 버튼("새로운 여행 만들기"), 프로필 아바타, 선택된 탭 아이콘 |
| `primarySoft` | `#EEF0FF` | `#2A2A4A` | primary의 옅은 배경 톤 — "예산 포켓 만들기" 같은 보조 버튼 배경 |
| `onPrimary` | `#ffffff` | `#ffffff` | primary 배경 위의 텍스트/아이콘 |
| `border` | `#E5E5EA` | `#3A3A3C` | 구분선 |
| `success` | `#34C759` | `#30D158` | 수입/환급 강조 |
| `danger` | `#FF3B30` | `#FF453A` | 지출/경고 강조 |

타이포그래피(`mobile/src/theme/typography.ts`)는 기존 `Fonts`(플랫폼별 시스템 폰트)를 유지하고, 화면 전반에서 재사용할 사이즈/굵기 스케일 `Typography`를 추가했다 (`largeTitle` 28/700 ~ `caption` 13/400).

스페이싱(`mobile/src/theme/spacing.ts`)은 기존 `src/constants/theme.ts`의 `Spacing`/`BottomTabInset`/`MaxContentWidth`를 그대로 이전했다.

`mobile/src/theme/index.ts`의 `useAppTheme()` 훅이 `colorScheme`에 따라 `colors`/`spacing`/`typography`/`fonts`를 한 번에 반환한다. 기존 `src/constants/theme.ts`와 `use-theme.ts`는 그대로 두었고(예제 화면 10개가 참조 중), Phase 2에서 실제 화면으로 교체하며 정리한다.

## 2. 데이터 모델 (`src/types/`)

PRD 5.3을 그대로 타입화했다. 엔티티 관계:

```
Trip (1) ──< (N) TripDestination
Trip (1) ──  (1) BudgetPocket
BudgetPocket (1) ──< (N) BudgetPocketTopUp
BudgetPocket (1) ──< (N) Expense  (Expense.pocketId)
Trip (1) ──< (N) Expense          (Expense.tripId)
Category (1) ──< (N) Expense      (Expense.categoryId)
```

- `Trip.companions`: 동행자 이름 목록 (본인 제외). `travelerCount = companions.length + 1`
- `Expense`의 포켓 차감액/자국화폐 환산액은 저장값이 아닌 화면 계산값 (PRD 5.3 주석 참고)
- `BudgetPocketTopUp.homeAmount`: 환전에 사용한 자국화폐 금액 — (통화, 결제수단) 평균환율 = `sum(homeAmount) / sum(amount)`
- `AppSettings`(자국화폐, 기본 결제수단, 환율 오버라이드, 보기모드)는 SQLite가 아닌 AsyncStorage에 저장 (`src/data/settings.ts`)

`CurrencyCode`는 `src/constants/currencies.ts`의 통화 목록(`code` 필드)에서 파생되는 유니언 타입이다.

## 3. SQLite 스키마 (`src/data/db.ts`)

`PRAGMA user_version`으로 마이그레이션을 관리한다 (현재 `DATABASE_VERSION = 1`).

| 테이블 | 주요 컬럼 | FK |
|---|---|---|
| `trips` | id, name, start_date, end_date, currency, cover_image, notes, companions(JSON TEXT), created_at, updated_at | - |
| `trip_destinations` | id, trip_id, country_code, country_flag, country_name_ko, start_date, end_date, order_index, created_at | trip_id → trips.id (CASCADE) |
| `budget_pockets` | id, trip_id(UNIQUE), name, created_at | trip_id → trips.id (CASCADE) |
| `budget_pocket_topups` | id, pocket_id, payment_method, currency, amount, home_amount, date, created_at | pocket_id → budget_pockets.id (CASCADE) |
| `categories` | id, label, icon, order_index, is_default | - |
| `expenses` | id, trip_id, type, payment_method, category_id, name, budget_source, amount, currency, date, is_pre_trip, notes, pocket_id, created_at | trip_id → trips.id, category_id → categories.id, pocket_id → budget_pockets.id (CASCADE) |

- `companions`는 SQLite에 JSON 문자열로 저장 (배열 컬럼 미지원)
- 불리언(`is_pre_trip`, `is_default`)은 0/1 INTEGER
- 마이그레이션 1단계에서 `categories`에 `src/constants/categories.ts`의 기본 6개(식비/쇼핑/교통/관광/숙박/미분류)를 `INSERT OR IGNORE`로 시드
- `trip_destinations`, `budget_pocket_topups`, `expenses`에 FK 컬럼 인덱스 생성

`src/app/_layout.tsx`에서 `SQLiteProvider`로 앱을 감싸고 `onInit={migrateDbIfNeeded}`로 앱 시작 시 1회 마이그레이션을 수행한다.

## 4. 디렉토리 구조 결정사항

- `tsconfig.json`의 `@/*` → `./src/*` 별칭으로 인해 Expo Router는 `mobile/src/app/`을 라우트 루트로 사용한다. PRD 5.2의 `app/...` 표기는 이 라우트 루트(`mobile/src/app/`) 기준 상대 경로로 해석한다.
- 기존 예제 화면(`src/app/index.tsx`, `explore.tsx`, `app-tabs.tsx` 등)은 Phase 2에서 PRD 4탭 구조(`trip/[tripId]/...`)로 교체된다. Phase 1에서는 새 디자인 토큰(`src/theme/`)만 추가하고 예제 화면은 변경하지 않았다.
