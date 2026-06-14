import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { DATABASE_NAME, migrateDbIfNeeded } from '@/data/db';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <SQLiteProvider databaseName={DATABASE_NAME} onInit={migrateDbIfNeeded}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="trip/new" options={{ presentation: 'modal' }} />
          <Stack.Screen name="trip/country" options={{ presentation: 'modal' }} />
          <Stack.Screen name="trip/[tripId]" />
        </Stack>
      </ThemeProvider>
    </SQLiteProvider>
  );
}
