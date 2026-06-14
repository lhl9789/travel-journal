# 여행의 모든 것 (TravelPocket)

여행 중 있었던 모든 것(경비, 일정, 기억)을 한 곳에 기록하고 관리하는 여행 가계부 서비스입니다.

## 프로젝트 구성

이 저장소는 두 개의 프로젝트로 구성되어 있습니다.

- **웹 (루트 디렉토리)**: Next.js 기반 CMS/소개 사이트
- **모바일 (`mobile/`)**: Expo(React Native) 기반 TravelPocket 모바일 앱 — 자세한 기획은 [`docs/PRD.md`](./docs/PRD.md) 참고

## 웹 프로젝트 시작하기

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 결과를 확인할 수 있습니다.

`app/page.tsx`를 수정하면 페이지가 자동으로 갱신됩니다. [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)로 [Geist](https://vercel.com/font) 폰트를 최적화하여 로드합니다.

### 기술 스택

- Next.js (App Router), TypeScript
- Tailwind CSS, shadcn/ui
- TanStack Query, TanStack Table
- React Hook Form + Zod

## 모바일 프로젝트 시작하기

```bash
cd mobile
npm install
npx expo start
```

자세한 내용은 [`mobile/README.md`](./mobile/README.md)와 [`docs/PRD.md`](./docs/PRD.md)를 참고하세요.

## 문서

- [PRD (제품 요구사항 정의서)](./docs/PRD.md)
