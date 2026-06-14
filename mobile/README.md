# TravelPocket Mobile

여행 중 지출/예산/통계를 기록·관리하는 iOS 앱입니다. (참조 앱: 트라비포켓)

자세한 기능 정의와 데이터 모델은 [`docs/PRD.md`](../docs/PRD.md)를 참고하세요.

## 주요 기능

- 여행 생성 및 목적지 구간(국가/기간) 관리
- 카테고리별 지출 기록 (현금/카드, 개인예산/공동예산, 다중 통화)
- 예산 포켓 충전 및 통화·결제수단별 잔액/평균환율 관리
- 카테고리/일별/통화별 통계
- 카테고리, 자국 화폐, 기본 결제수단, 환율 설정

## 기술 스택

- Expo (React Native) + Expo Router
- TypeScript
- expo-sqlite (로컬 DB) + AsyncStorage (설정 저장)
- @gorhom/bottom-sheet
- react-native-gifted-charts + react-native-svg
- date-fns

데이터는 모두 기기 로컬에 저장되며 별도의 인증/서버가 없습니다.

## 시작하기

1. 의존성 설치

   ```bash
   npm install
   ```

2. 앱 실행

   ```bash
   npx expo start
   ```

출력된 옵션을 통해 [개발 빌드](https://docs.expo.dev/develop/development-builds/introduction/), [Android 에뮬레이터](https://docs.expo.dev/workflow/android-studio-emulator/), [iOS 시뮬레이터](https://docs.expo.dev/workflow/ios-simulator/), [Expo Go](https://expo.dev/go) 중 원하는 환경에서 앱을 열 수 있습니다.

## 디렉토리 구조

```
mobile/
├── app/                # 화면 (Expo Router 파일 기반 라우팅)
└── src/
    ├── components/     # UI / 도메인별 컴포넌트
    ├── data/           # 로컬 DB 접근 (expo-sqlite)
    ├── types/           # 데이터 모델 타입
    ├── theme/           # 색상, 스페이싱, 타이포그래피
    ├── constants/       # 카테고리, 국가, 통화 등 상수
    ├── hooks/
    └── utils/
```

자세한 구조와 구현 Phase 로드맵은 [`docs/PRD.md`](../docs/PRD.md)의 5장, 6장을 참고하세요.
