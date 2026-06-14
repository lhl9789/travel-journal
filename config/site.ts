export const siteConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME ?? "여행의 모든 것",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  description: "여행 중 있었던 모든 것(경비, 일정, 기억)을 한 곳에 기록하고 관리하는 여행 가계부 TravelPocket",
  version: "0.1.0",
  links: {
    github: "https://github.com",
  },
}

export type SiteConfig = typeof siteConfig
