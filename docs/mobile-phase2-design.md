# Mobile Phase 2 설계 노트 — 홈 + 여행 CRUD

`docs/PRD.md` 6장 로드맵의 Phase 2 구현 결과를 정리한다. 대상: `mobile/src/app/index.tsx`, `mobile/src/app/trip/`, `mobile/src/data/{trips,tripDestinations,budgetPockets}.ts`, `mobile/src/components/trip/`.

## 1. 디렉토리 구조 결정사항 — `[tripId]/` 4탭 + Stack 구조

PRD 5.2는 `app/trip/[tripId]/_layout.tsx`를 "4탭 + 공통 헤더"로, `destinations.tsx`/`menu.tsx`를 그 형제 파일로 표기한다. 그러나 `unstable-native-tabs`의 `NativeTabs`는 그 자체가 라우트 그룹의 navigator여야 하므로, 같은 레이어에 탭이 아닌 화면(`destinations`, `menu`)을 함께 둘 수 없다. 따라서 한 단계를 더 나눠 다음과 같이 구성했다.

```
src/app/_layout.tsx                          # 루트 Stack: index / trip/new(modal) / trip/country(modal) / trip/[tripId]
src/app/trip/new.tsx                         # 여행 생성 바텀시트 (modal)
src/app/trip/country.tsx                     # 국가 선택 + 기간 입력 (modal)
src/app/trip/[tripId]/_layout.tsx            # Stack: (tabs) / destinations / menu(modal)
src/app/trip/[tripId]/(tabs)/_layout.tsx     # TripTabs (NativeTabs 4탭)
src/app/trip/[tripId]/(tabs)/index.tsx       # 프로필 탭
src/app/trip/[tripId]/(tabs)/budget.tsx      # 예산 탭 (Phase 3 placeholder)
src/app/trip/[tripId]/(tabs)/expenses.tsx    # 지출내역 탭 (Phase 4 placeholder)
src/app/trip/[tripId]/(tabs)/stats.tsx       # 통계 탭 (Phase 5 placeholder)
src/app/trip/[tripId]/destinations.tsx       # 목적지 구간 관리 (탭 밖, Stack push)
src/app/trip/[tripId]/menu.tsx               # "..." 메뉴 (modal)
```

`(tabs)` 라우트 그룹은 URL 경로에 영향을 주지 않으므로 `/trip/[tripId]`는 그대로 프로필 탭(`(tabs)/index.tsx`)으로 연결된다. 각 탭 화면은 공용 `TripHeader`(홈 아이콘 / 제목 / "..." 메뉴)를 직접 렌더링한다 — `NativeTabs`는 자체 상단 헤더를 제공하지 않기 때문이다.

루트 `_layout.tsx`는 기존 2탭(`index`/`explore`) `AppTabs`를 더 이상 사용하지 않으므로 `Stack`으로 교체했다. 예제 화면(`explore.tsx`, `app-tabs.tsx`, `app-tabs.web.tsx`, `hint-row.tsx`, `web-badge.tsx`, `external-link.tsx`, `ui/collapsible.tsx`)은 모두 삭제했다 (단, 스플래시에 쓰이는 `animated-icon`/`animated-icon.web`은 유지).

## 2. "바텀시트" = Stack modal presentation

`trip/new`, `trip/country`, `trip/[tripId]/menu`는 `Stack.Screen options={{ presentation: 'modal' }}` + 화면 상단의 드래그 핸들 바(`View` 36×4, `theme.border` 색)로 바텀시트 느낌을 구현했다. `@gorhom/bottom-sheet`는 화면 내 임시 시트(카테고리 선택 등, Phase 4 이후)에 사용할 예정이다.

## 3. 여행 생성 흐름 (`trip/new.tsx`, `trip/country.tsx`)

- `country.tsx`는 한 화면에서 2단계로 동작: (1) 검색 가능한 국가 목록(국기+한글명+코드, `searchCountries`) → 선택 시 (2) 동일 화면이 시작일/종료일 `DateField`로 전환되고, "다시 선택"으로 (1)로 복귀 가능.
- 완성된 구간은 모듈 레벨 스토어 `src/utils/draft-destination.ts`(`setDraftDestination`/`takeDraftDestination`)에 저장 후 `router.back()`. 호출 화면(`new.tsx`, `[tripId]/destinations.tsx`)은 `useFocusEffect`에서 draft를 꺼내 목적지 목록에 반영한다.
- "완료" 시 `createTrip()`이 트랜잭션 내에서 trip + 모든 목적지 구간 + 동일 이름의 `budget_pockets` 행(PRD 3.3 자동 생성)을 생성하고 `router.replace('/trip/[tripId]')`로 이동한다.

## 4. 여행 상세 — 프로필 탭 / 구간 관리 / "..." 메뉴

- 프로필 탭(`(tabs)/index.tsx`): 커버 이미지(`expo-image-picker`로 교체), 기간(목적지 구간들로부터 자동 계산되어 읽기 전용 표시), 메모(인라인 편집, blur 시 저장), 멤버(`CompanionList`, 변경 즉시 저장), 목적지 구간 요약 + "구간 관리" 진입점.
- `destinations.tsx`: 구간 목록 + "구간 추가하기"(→ `trip/country` 재사용) + 구간별 삭제(X). 마지막 구간 1개는 삭제 불가(여행은 최소 1개 구간 필요) — `recalculateTripDateRange`가 구간이 0개가 되면 날짜를 갱신하지 않으므로 데이터 정합성을 위해 UI에서 막았다.
- `menu.tsx`: 여행 이름 인라인 편집(blur 시 저장), 기본 통화 변경(`CURRENCIES` 목록 + 체크 표시), 여행 삭제(`Alert` 확인 → `deleteTrip` → FK CASCADE로 구간/포켓 함께 삭제 → 홈으로 `replace`).

## 5. 인라인 편집 상태 패턴

메모/이름처럼 DB 값을 그대로 보여주다 편집하는 입력은 `useEffect`로 props→state를 동기화하지 않고, `nullable draft state`(`xxxDraft: string | null`)를 사용한다. `draft ?? trip.field`로 표시값을 계산하고, blur 시 draft가 있고 실제로 변경되었을 때만 `updateTrip` 후 draft를 초기화한다. (`react-hooks/set-state-in-effect` 린트 회피 + 불필요한 리렌더 방지)
