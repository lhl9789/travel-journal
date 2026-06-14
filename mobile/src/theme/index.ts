import { useColorScheme } from '@/hooks/use-color-scheme'
import { Colors } from './colors'
import { BottomTabInset, MaxContentWidth, Spacing } from './spacing'
import { Fonts, Typography } from './typography'

export * from './colors'
export * from './spacing'
export * from './typography'

export function useAppTheme() {
  const scheme = useColorScheme()
  const mode = scheme === 'dark' ? 'dark' : 'light'

  return {
    mode,
    colors: Colors[mode],
    spacing: Spacing,
    typography: Typography,
    fonts: Fonts,
    bottomTabInset: BottomTabInset,
    maxContentWidth: MaxContentWidth,
  }
}
