# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code. Heed deprecation notices.

# TravelPocket Mobile

여행 중 지출/예산/통계를 기록·관리하는 iOS 앱입니다. 기능 정의, 화면 흐름, 데이터 모델, 구현 Phase는 [`../docs/PRD.md`](../docs/PRD.md)를 기준 문서로 따릅니다. 작업 전에 관련 섹션(3. 핵심 기능, 5. 기술 아키텍처, 6. Phase 로드맵)을 확인하세요.

- 데이터는 로컬(expo-sqlite + AsyncStorage)에만 저장되며 인증/서버는 없습니다.
- 디렉토리 구조: 화면은 `app/`(Expo Router 파일 기반 라우팅), 그 외 구현은 `src/`(components, data, types, theme, constants, hooks, utils)에 위치합니다.
