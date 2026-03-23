import React, { useContext } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Button, Checkbox, TextInput } from 'react-native-paper';
import { AppContext } from '../../context/AppContext';

export default function SettingsScreen() {
  const context = useContext(AppContext);
  const isDarkMode = context?.isDarkMode || false;
  const styles = getStyles(isDarkMode);

  // Вихід з акаунта
  const handleLogout = () => {
    context?.logout();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      {/* Інформація про користувача (Пункт 6 завдання) */}
      <View style={styles.profileSection}>
        <Text style={styles.profileTitle}>Профіль користувача</Text>
        <Text style={styles.profileText}>Авторизовано як: <Text style={{fontWeight: 'bold'}}>{context?.userName}</Text></Text>
        <Button mode="outlined" onPress={handleLogout} textColor="#FF3B30" style={styles.logoutButton}>
          Вийти з облікового запису
        </Button>
      </View>

      <Text style={styles.sectionTitle}>Налаштування додатку</Text>
      
      <TextInput
        label="Змінити відображуване ім'я"
        value={context?.userName}
        onChangeText={context?.setUserName}
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
          onValueChange={context?.toggleTheme}
          value={context?.isDarkMode}
        />
      </View>
      
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Сповіщення про оренду</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#34C759' }}
          thumbColor={context?.notificationsEnabled ? '#ffffff' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={context?.toggleNotifications}
          value={context?.notificationsEnabled}
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Отримувати новини на Email</Text>
        <Checkbox.Android
          status={context?.newsletterEnabled ? 'checked' : 'unchecked'}
          onPress={context?.toggleNewsletter}
          color="#007AFF"
          uncheckedColor={isDarkMode ? '#AAA' : '#666'}
        />
      </View>

    </ScrollView>
  );
}

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? '#121212' : '#F5F5F7',
  },
  content: {
    padding: 24,
  },
  profileSection: {
    backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDarkMode ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDarkMode ? '#FFFFFF' : '#1C1C1E',
    marginBottom: 8,
  },
  profileText: {
    fontSize: 16,
    color: isDarkMode ? '#AAAAAA' : '#333333',
    marginBottom: 16,
  },
  logoutButton: {
    borderColor: '#FF3B30',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
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
  input: {
    marginBottom: 16,
    backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
  },
});