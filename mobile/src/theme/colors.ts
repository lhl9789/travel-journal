/**
 * 디자인 토큰: 색상
 * 참조 디자인 시안(메인화면.png, 여행세부_예산탭_메인화면.png, 설정화면.png)의
 * 인디고/바이올렛 포인트 컬러와 라벤더 톤 보조 배경을 기준으로 정의
 */
export const Colors = {
  light: {
    text: '#000000',
    textSecondary: '#60646C',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    /** 포인트 컬러 (플로팅 버튼, 선택된 탭, 아바타 등) */
    primary: '#6C63FF',
    /** primary의 옅은 배경 톤 (보조 버튼, 강조 카드 배경) */
    primarySoft: '#EEF0FF',
    /** 포인트 컬러 위에 올라가는 텍스트/아이콘 */
    onPrimary: '#ffffff',
    border: '#E5E5EA',
    /** 수입/환급 강조색 */
    success: '#34C759',
    /** 지출/경고 강조색 */
    danger: '#FF3B30',
  },
  dark: {
    text: '#ffffff',
    textSecondary: '#B0B4BA',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    primary: '#8B85FF',
    primarySoft: '#2A2A4A',
    onPrimary: '#ffffff',
    border: '#3A3A3C',
    success: '#30D158',
    danger: '#FF453A',
  },
} as const

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark
