import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

export default function TabLayout() {
  const context = useContext(AppContext);
  const isDarkMode = context?.isDarkMode || false;

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
        },
        headerTintColor: isDarkMode ? '#FFFFFF' : '#000000',
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
          borderTopColor: isDarkMode ? '#333333' : '#E0E0E0',
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: isDarkMode ? '#888888' : '#8E8E93',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Каталог',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="hanger" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Додати',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="plus-circle" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Налаштування',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="cog" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}