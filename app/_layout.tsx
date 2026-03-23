import { Stack, useRouter, useSegments } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Provider as PaperProvider } from 'react-native-paper';
import { AppContext, AppProvider } from "../context/AppContext";

// Внутрішній компонент, який використовує контекст для маршрутизації
function RootNavigator() {
  const context = useContext(AppContext);
  const router = useRouter();
  const segments = useSegments();
  
  // Цей стан потрібен, щоб переконатися, що Expo Router встиг завантажитись
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  useEffect(() => {
    setIsNavigationReady(true);
  }, []);

  // Цей ефект спрацьовує щоразу, коли змінюється стан авторизації або поточна сторінка
  useEffect(() => {
    if (!context || !isNavigationReady) return;

    // Приводимо segments[0] до типу string, щоб уникнути помилки TS2367
    const inAuthGroup = (segments[0] as string) === 'login';

    if (!context.isAuthenticated && !inAuthGroup) {
      // Якщо не авторизований, і намагається зайти на закриту сторінку -> кидаємо на логін
      // Приводимо маршрут до any, щоб уникнути помилки TS2345
      router.replace('/login' as any);
    } else if (context.isAuthenticated && inAuthGroup) {
      // Якщо авторизований, але сидить на сторінці логіну -> кидаємо на головний екран
      router.replace('/' as any);
    }
  }, [context?.isAuthenticated, segments, isNavigationReady]);

  return (
    // Використовуємо Stack Navigator як основний (Пункт 4 завдання)
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" options={{ animation: 'fade' }} />
      <Stack.Screen name="index" options={{ animation: 'fade' }} />
    </Stack>
  );
}

// Головний експорт: обгортаємо додаток Провайдерами
export default function RootLayout() {
  return (
    <AppProvider>
      <PaperProvider>
        <RootNavigator />
      </PaperProvider>
    </AppProvider>
  );
}