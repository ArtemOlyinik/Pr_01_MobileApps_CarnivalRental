import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
// Додали Checkbox для нових налаштувань
import { Appbar, Button, Checkbox, Dialog, IconButton, Menu, Provider as PaperProvider, Paragraph, Portal, TextInput } from 'react-native-paper';

interface CostumeData {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
}

interface CostumeCardProps {
  item: CostumeData;
  isDarkMode: boolean;
  onDelete: (id: string) => void;
  onPress: (item: CostumeData) => void;
}

const generateDescription = (i: number, category: string) => {
  return `Це чудовий карнавальний костюм номер ${i + 1}. Ідеально підходить для тематичних вечірок, святкувань Хелловіну або новорічних корпоративів. Матеріал високої якості, дуже зручний. Категорія: ${category}.`;
};

const initialCostumes: CostumeData[] = Array.from({ length: 20 }, (_, i) => {
  const category = i % 2 === 0 ? 'Дорослий' : 'Дитячий';
  return {
    id: String(i + 1),
    name: `Карнавальний костюм #${i + 1}`,
    category: category,
    price: `${(i + 1) * 150} грн/доба`,
    description: generateDescription(i, category),
  };
});

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: isDarkMode ? '#121212' : '#F5F5F7',
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
    alignItems: 'center',
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
  addScreenContainer: {
    padding: 24,
  },
  input: {
    marginBottom: 16,
    backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
  },
  button: {
    marginTop: 16,
    paddingVertical: 6,
  },
});

const CostumeCard = ({ item, isDarkMode, onDelete, onPress }: CostumeCardProps) => {
  const styles = getStyles(isDarkMode);
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item)} activeOpacity={0.7}>
      <View style={styles.imagePlaceholder}>
        <Text style={styles.imageText}>Фото</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardDescription}>Категорія: {item.category}</Text>
        <Text style={styles.cardPrice}>Ціна: {item.price}</Text>
      </View>
      <IconButton
        icon="delete"
        iconColor="#FF3B30"
        size={24}
        onPress={() => onDelete(item.id)}
      />
    </TouchableOpacity>
  );
};

export default function Index() {
  const [activeScreen, setActiveScreen] = useState<'catalog' | 'settings' | 'add'>('catalog');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  
  // Додаткові стани для нових налаштувань (пункт 4)
  const [userName, setUserName] = useState('');
  const [newsletterEnabled, setNewsletterEnabled] = useState(false);
  
  const [menuVisible, setMenuVisible] = useState(false);
  const [costumesData, setCostumesData] = useState<CostumeData[]>(initialCostumes);

  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const [validationDialogVisible, setValidationDialogVisible] = useState(false);
  
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [costumeToDelete, setCostumeToDelete] = useState<string | null>(null);
  
  const [detailsDialogVisible, setDetailsDialogVisible] = useState(false);
  const [selectedCostume, setSelectedCostume] = useState<CostumeData | null>(null);

  const styles = getStyles(isDarkMode);

  const toggleSwitch = () => setIsDarkMode(previousState => !previousState);
  const toggleNotifications = () => setNotificationsEnabled(previousState => !previousState);
  const toggleNewsletter = () => setNewsletterEnabled(!newsletterEnabled);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleScreenChange = (screen: 'catalog' | 'settings' | 'add') => {
    setActiveScreen(screen);
    closeMenu();
  };

  const getHeaderTitle = () => {
    switch (activeScreen) {
      case 'catalog': return 'Каталог костюмів';
      case 'add': return 'Додати костюм';
      case 'settings': return 'Налаштування';
      default: return 'Carnival Rentals';
    }
  };

  const handleAddCostume = () => {
    if (newName.trim() === '' || newCategory.trim() === '' || newPrice.trim() === '') {
      setValidationDialogVisible(true);
      return;
    }

    const newCostume: CostumeData = {
      id: Date.now().toString(),
      name: newName,
      category: newCategory,
      price: `${newPrice} грн/доба`,
      description: newDescription.trim() === '' ? 'Опис відсутній.' : newDescription,
    };

    setCostumesData(prevData => [newCostume, ...prevData]);

    setNewName('');
    setNewCategory('');
    setNewPrice('');
    setNewDescription('');

    setActiveScreen('catalog');
  };

  const confirmDelete = (id: string) => {
    setCostumeToDelete(id);
    setDeleteConfirmVisible(true);
  };

  const executeDelete = () => {
    if (costumeToDelete) {
      setCostumesData(prevData => prevData.filter(item => item.id !== costumeToDelete));
    }
    setDeleteConfirmVisible(false);
    setCostumeToDelete(null);
  };

  const cancelDelete = () => {
    setDeleteConfirmVisible(false);
    setCostumeToDelete(null);
  };

  const handleOpenDetails = (item: CostumeData) => {
    setSelectedCostume(item);
    setDetailsDialogVisible(true);
  };

  return (
    <PaperProvider>
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
        
        <Appbar.Header style={{ backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }}>
          <Appbar.Content 
            title={getHeaderTitle()} 
            titleStyle={{ color: isDarkMode ? '#FFFFFF' : '#333333', fontWeight: 'bold' }} 
          />
          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={<Appbar.Action icon="menu" color={isDarkMode ? '#FFFFFF' : '#333333'} onPress={openMenu} />}>
            <Menu.Item onPress={() => handleScreenChange('catalog')} title="Каталог костюмів" />
            <Menu.Item onPress={() => handleScreenChange('add')} title="Додати костюм" />
            <Menu.Item onPress={() => handleScreenChange('settings')} title="Налаштування" />
          </Menu>
        </Appbar.Header>

        <View style={styles.contentContainer}>
          {activeScreen === 'catalog' && (
            <FlatList
              data={costumesData}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <CostumeCard 
                  item={item} 
                  isDarkMode={isDarkMode} 
                  onDelete={confirmDelete} 
                  onPress={handleOpenDetails}
                />
              )}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          )}

          {activeScreen === 'add' && (
            <KeyboardAvoidingView 
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ flex: 1 }}
            >
              <ScrollView contentContainerStyle={styles.addScreenContainer}>
                <Text style={styles.settingsTitle}>Новий костюм</Text>
                
                <TextInput
                  label="Назва костюма"
                  value={newName}
                  onChangeText={setNewName}
                  style={styles.input}
                  mode="outlined"
                  textColor={isDarkMode ? '#FFF' : '#000'}
                  activeOutlineColor="#007AFF"
                  outlineColor={isDarkMode ? '#555' : '#CCC'}
                  theme={{ colors: { onSurfaceVariant: isDarkMode ? '#AAA' : '#666' } }}
                />
                
                <TextInput
                  label="Категорія (Дорослий/Дитячий)"
                  value={newCategory}
                  onChangeText={setNewCategory}
                  style={styles.input}
                  mode="outlined"
                  textColor={isDarkMode ? '#FFF' : '#000'}
                  activeOutlineColor="#007AFF"
                  outlineColor={isDarkMode ? '#555' : '#CCC'}
                  theme={{ colors: { onSurfaceVariant: isDarkMode ? '#AAA' : '#666' } }}
                />
                
                <TextInput
                  label="Ціна (тільки число)"
                  value={newPrice}
                  onChangeText={setNewPrice}
                  keyboardType="numeric"
                  style={styles.input}
                  mode="outlined"
                  textColor={isDarkMode ? '#FFF' : '#000'}
                  activeOutlineColor="#007AFF"
                  outlineColor={isDarkMode ? '#555' : '#CCC'}
                  theme={{ colors: { onSurfaceVariant: isDarkMode ? '#AAA' : '#666' } }}
                />

                <TextInput
                  label="Детальний опис (необов'язково)"
                  value={newDescription}
                  onChangeText={setNewDescription}
                  multiline
                  numberOfLines={3}
                  style={[styles.input, { height: 100 }]}
                  mode="outlined"
                  textColor={isDarkMode ? '#FFF' : '#000'}
                  activeOutlineColor="#007AFF"
                  outlineColor={isDarkMode ? '#555' : '#CCC'}
                  theme={{ colors: { onSurfaceVariant: isDarkMode ? '#AAA' : '#666' } }}
                />

                <Button 
                  mode="contained" 
                  onPress={handleAddCostume} 
                  style={styles.button}
                  buttonColor="#007AFF"
                >
                  Зберегти костюм
                </Button>
              </ScrollView>
            </KeyboardAvoidingView>
          )}

          {activeScreen === 'settings' && (
            <KeyboardAvoidingView 
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ flex: 1 }}
            >
              <ScrollView contentContainerStyle={styles.settingsContainer}>
                <Text style={styles.settingsTitle}>Налаштування додатку</Text>
                
                {/* Нове поле вводу для налаштувань */}
                <TextInput
                  label="Ваше ім'я (для профілю)"
                  value={userName}
                  onChangeText={setUserName}
                  style={styles.input}
                  mode="outlined"
                  textColor={isDarkMode ? '#FFF' : '#000'}
                  activeOutlineColor="#007AFF"
                  outlineColor={isDarkMode ? '#555' : '#CCC'}
                  theme={{ colors: { onSurfaceVariant: isDarkMode ? '#AAA' : '#666' } }}
                />
                
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

                {/* Новий Checkbox для налаштувань (Використовуємо Checkbox.Android для видимої рамки на iOS) */}
                <View style={styles.settingItem}>
                  <Text style={styles.settingText}>Отримувати новини на Email</Text>
                  <Checkbox.Android
                    status={newsletterEnabled ? 'checked' : 'unchecked'}
                    onPress={toggleNewsletter}
                    color="#007AFF"
                    uncheckedColor={isDarkMode ? '#AAA' : '#666'}
                  />
                </View>

              </ScrollView>
            </KeyboardAvoidingView>
          )}
        </View>

        <Portal>
          <Dialog visible={validationDialogVisible} onDismiss={() => setValidationDialogVisible(false)} style={{ backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF' }}>
            <Dialog.Title style={{ color: isDarkMode ? '#FFF' : '#000' }}>Помилка</Dialog.Title>
            <Dialog.Content>
              <Paragraph style={{ color: isDarkMode ? '#AAA' : '#333' }}>Будь ласка, заповніть всі обов'язкові поля (Назва, Категорія, Ціна).</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setValidationDialogVisible(false)} textColor="#007AFF">ОК</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <Portal>
          <Dialog visible={deleteConfirmVisible} onDismiss={cancelDelete} style={{ backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF' }}>
            <Dialog.Title style={{ color: isDarkMode ? '#FFF' : '#000' }}>Підтвердження</Dialog.Title>
            <Dialog.Content>
              <Paragraph style={{ color: isDarkMode ? '#AAA' : '#333' }}>Ви впевнені, що хочете видалити цей костюм зі списку?</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={cancelDelete} textColor="#8E8E93">Скасувати</Button>
              <Button onPress={executeDelete} textColor="#FF3B30">Видалити</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <Portal>
          <Dialog visible={detailsDialogVisible} onDismiss={() => setDetailsDialogVisible(false)} style={{ backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF' }}>
            <Dialog.Title style={{ color: isDarkMode ? '#FFF' : '#000', fontSize: 22 }}>{selectedCostume?.name}</Dialog.Title>
            <Dialog.Content>
              <Paragraph style={{ color: isDarkMode ? '#AAA' : '#555', marginBottom: 8, fontWeight: 'bold' }}>
                Категорія: <Text style={{ fontWeight: 'normal' }}>{selectedCostume?.category}</Text>
              </Paragraph>
              <Paragraph style={{ color: isDarkMode ? '#32D74B' : '#34C759', marginBottom: 16, fontWeight: 'bold', fontSize: 18 }}>
                {selectedCostume?.price}
              </Paragraph>
              <Paragraph style={{ color: isDarkMode ? '#DDD' : '#333', lineHeight: 22 }}>
                {selectedCostume?.description}
              </Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setDetailsDialogVisible(false)} textColor="#007AFF">Закрити</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        
      </SafeAreaView>
    </PaperProvider>
  );
}