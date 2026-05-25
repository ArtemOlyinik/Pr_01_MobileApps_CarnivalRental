import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRootNavigationState, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useStore } from '../store/useStore';

const queryClient = new QueryClient();

export default function RootLayout() {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();
  
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !navigationState?.key) return;

    const inAuthScreen = segments[0] === 'login';

    const timeout = setTimeout(() => {
      if (!isAuthenticated && !inAuthScreen) {
        router.replace('/login');
      } else if (isAuthenticated) {
        // ВИПРАВЛЕНО: Замість segments.length === 0 перевіряємо відсутність першого сегмента
        if (inAuthScreen || !segments[0]) {
          router.replace('/(tabs)');
        }
      }
    }, 1);

    return () => clearTimeout(timeout);
  }, [isAuthenticated, segments, navigationState?.key, isMounted]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <PaperProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="costume/[id]" options={{ headerShown: true, title: 'Деталі' }} />
          </Stack>
        </PaperProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}