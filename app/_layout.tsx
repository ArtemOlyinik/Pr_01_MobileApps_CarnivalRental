import { Stack, useRouter, useSegments } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Provider as PaperProvider } from 'react-native-paper';
import { AppContext, AppProvider } from "../context/AppContext";
// ДОДАНО: Імпорти для React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// ДОДАНО: Створюємо клієнт для кешування
const queryClient = new QueryClient();

function RootNavigator() {
  const context = useContext(AppContext);
  const router = useRouter();
  const segments = useSegments();
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  useEffect(() => {
    setIsNavigationReady(true);
  }, []);

  useEffect(() => {
    if (!context || !isNavigationReady) return;

    const inAuthGroup = (segments[0] as string) === 'login';

    if (!context.isAuthenticated && !inAuthGroup) {
      router.replace('/login' as any);
    } else if (context.isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)' as any);
    }
  }, [context?.isAuthenticated, segments, isNavigationReady]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" options={{ animation: 'fade' }} />
      <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    // ДОДАНО: Обгортка QueryClientProvider
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <PaperProvider>
          <RootNavigator />
        </PaperProvider>
      </AppProvider>
    </QueryClientProvider>
  );
}