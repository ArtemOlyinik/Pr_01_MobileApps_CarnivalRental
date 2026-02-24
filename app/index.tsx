import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, SafeAreaView, StatusBar, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

interface CostumeData {
  id: string;
  name: string;
  category: string;
  price: string;
}

interface CostumeCardProps {
  name: string;
  category: string;
  price: string;
  isDarkMode: boolean;
}

const costumesData: CostumeData[] = Array.from({ length: 20 }, (_, i) => ({
  id: String(i + 1),
  name: `Карнавальний костюм #${i + 1}`,
  category: i % 2 === 0 ? 'Дорослий' : 'Дитячий',
  price: `${(i + 1) * 150} грн/доба`,
}));

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: isDarkMode ? '#121212' : '#F5F5F7',
  },
  header: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? '#333333' : '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDarkMode ? '#FFFFFF' : '#333333',
  },
  navBar: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'center',
    gap: 12,
  },
  navButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: isDarkMode ? '#333333' : '#E0E0E0',
  },
  activeButton: {
    backgroundColor: '#007AFF',
  },
  navButtonText: {
    fontSize: 16,
    color: isDarkMode ? '#AAAAAA' : '#555555',
    fontWeight: '600',
  },
  activeButtonText: {
    color: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDarkMode ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: isDarkMode ? '#333333' : '#E5E5EA',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  imageText: {
    color: isDarkMode ? '#AAAAAA' : '#8E8E93',
    fontSize: 12,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: isDarkMode ? '#FFFFFF' : '#1C1C1E',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: isDarkMode ? '#AAAAAA' : '#8E8E93',
    marginBottom: 8,
  },
  cardPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: isDarkMode ? '#32D74B' : '#34C759',
  },
  settingsContainer: {
    flex: 1,
    padding: 24,
  },
  settingsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    color: isDarkMode ? '#FFFFFF' : '#1C1C1E',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? '#333333' : '#E5E5EA',
  },
  settingText: {
    fontSize: 18,
    color: isDarkMode ? '#FFFFFF' : '#333333',
  },
});

const CostumeCard = ({ name, category, price, isDarkMode }: CostumeCardProps) => {
  const styles = getStyles(isDarkMode);
  return (
    <View style={styles.card}>
      <View style={styles.imagePlaceholder}>
        <Text style={styles.imageText}>Фото</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{name}</Text>
        <Text style={styles.cardDescription}>Категорія: {category}</Text>
        <Text style={styles.cardPrice}>Ціна: {price}</Text>
      </View>
    </View>
  );
};

export default function Index() {
  const [activeScreen, setActiveScreen] = useState<'catalog' | 'settings'>('catalog');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const styles = getStyles(isDarkMode);

  const toggleSwitch = () => setIsDarkMode(previousState => !previousState);
  const toggleNotifications = () => setNotificationsEnabled(previousState => !previousState);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Carnival Rentals</Text>
      </View>

      <View style={styles.navBar}>
        <TouchableOpacity
          style={[styles.navButton, activeScreen === 'catalog' && styles.activeButton]}
          onPress={() => setActiveScreen('catalog')}
        >
          <Text style={[styles.navButtonText, activeScreen === 'catalog' && styles.activeButtonText]}>
            Каталог
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.navButton, activeScreen === 'settings' && styles.activeButton]}
          onPress={() => setActiveScreen('settings')}
        >
          <Text style={[styles.navButtonText, activeScreen === 'settings' && styles.activeButtonText]}>
            Налаштування
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        {activeScreen === 'catalog' ? (
          <FlatList
            data={costumesData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CostumeCard 
                name={item.name} 
                category={item.category} 
                price={item.price} 
                isDarkMode={isDarkMode} 
              />
            )}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.settingsContainer}>
            <Text style={styles.settingsTitle}>Налаштування додатку</Text>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingText}>Темна тема</Text>
              <Switch
                trackColor={{ false: '#767577', true: '#34C759' }}
                thumbColor={isDarkMode ? '#ffffff' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isDarkMode}
              />
            </View>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingText}>Сповіщення про оренду</Text>
              <Switch
                trackColor={{ false: '#767577', true: '#34C759' }}
                thumbColor={notificationsEnabled ? '#ffffff' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleNotifications}
                value={notificationsEnabled}
              />
            </View>
            
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}