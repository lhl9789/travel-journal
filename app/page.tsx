import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { TripCard } from "@/components/trips/trip-card"
import { ROUTES } from "@/lib/constants"
import { trips } from "@/lib/mock-data"
import { ArrowRight, Wallet, PieChart, Globe2, NotebookPen } from "lucide-react"

const features = [
  {
    icon: Wallet,
    title: "경비 관리",
    description: "카테고리별 지출을 기록하고 예산 대비 사용액을 한눈에 확인하세요",
  },
  {
    icon: Globe2,
    title: "다중 통화 지원",
    description: "10개국 통화의 실시간 환율을 적용해 원화로 자동 환산해드려요",
  },
  {
    icon: PieChart,
    title: "예산 분석",
    description: "카테고리별 비율과 일별 지출 추이를 차트로 확인하세요",
  },
  {
    icon: NotebookPen,
    title: "여행별 기록 관리",
    description: "여행마다 경비 내역을 따로 정리하고 한눈에 비교해보세요",
  },
]

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="flex flex-col items-center justify-center gap-6 py-24 px-4 text-center">
          <Badge variant="secondary">여행 가계부 · TravelPocket</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            여행 중 있었던 모든 것을
            <br />
            한 곳에 기록하세요
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            경비, 일정, 기억까지 — 여행의 모든 것을 관리하는 가장 쉬운 방법
          </p>
          <div className="flex gap-3">
            <Button asChild size="lg">
              <Link href={ROUTES.DASHBOARD}>
                무료로 시작하기 <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href={ROUTES.LOGIN}>로그인</Link>
            </Button>
          </div>
        </section>

        <section className="border-t py-20 px-4">
          <div className="container mx-auto">
            <h2 className="text-center text-2xl font-bold mb-12">주요 기능</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex flex-col items-center gap-3 text-center p-6 rounded-xl border bg-card"
                >
                  <div className="rounded-lg bg-primary/10 p-3">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t py-20 px-4 bg-muted/30">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold">이런 여행을 기록할 수 있어요</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  여행 카드를 눌러 경비 목록과 예산 분석을 살펴보세요
                </p>
              </div>
              <Button variant="ghost" asChild className="hidden sm:flex">
                <Link href={ROUTES.TRIPS}>
                  전체보기 <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {trips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          </div>
        </section>

        <section className="border-t py-20 px-4">
          <div className="container mx-auto">
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
                <h2 className="text-2xl font-bold">지금 바로 여행 기록을 시작해보세요</h2>
                <p className="text-primary-foreground/80 max-w-md">
                  무료로 가입하고 첫 번째 여행을 만들어보세요. 경비 입력부터 예산 분석까지 한 번에.
                </p>
                <Button size="lg" variant="secondary" asChild>
                  <Link href={ROUTES.REGISTER}>
                    무료로 시작하기 <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
