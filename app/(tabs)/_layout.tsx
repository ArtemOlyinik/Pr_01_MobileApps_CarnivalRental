import { Ionicons } from '@expo/vector-icons'; // Додаємо іконки
import { Tabs } from 'expo-router';
import { useStore } from '../../store/useStore';

export default function TabsLayout() {
  const isDarkMode = useStore((state) => state.isDarkMode);

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
          borderTopColor: isDarkMode ? '#333333' : '#E5E5EA',
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: isDarkMode ? '#AAAAAA' : '#8E8E93',
        headerStyle: {
          backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
        },
        headerTintColor: isDarkMode ? '#FFFFFF' : '#000000',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Каталог',
          tabBarLabel: 'Каталог',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Додати',
          tabBarLabel: 'Додати',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Налаштування',
          tabBarLabel: 'Налаштування',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}