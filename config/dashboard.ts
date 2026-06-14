import {
  LayoutDashboard,
  Settings,
  Plane,
  BarChart3,
} from "lucide-react"
import { SidebarNavItem } from "@/types"

export const dashboardSidebarNav: SidebarNavItem[] = [
  {
    title: "대시보드",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "나의 여행",
    href: "/dashboard/trips",
    icon: Plane,
  },
  {
    title: "예산 분석",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "설정",
    href: "/dashboard/settings",
    icon: Settings,
  },
]
