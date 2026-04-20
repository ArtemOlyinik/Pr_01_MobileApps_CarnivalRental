import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Button, Checkbox, Switch, Text, TextInput } from 'react-native-paper';
import { useStore } from '../../store/useStore';

export default function SettingsScreen() {
  // Витягуємо всі функції налаштувань із Zustand
  const {
    isDarkMode, toggleTheme,
    userName, setUserName,
    notificationsEnabled, toggleNotifications,
    newsletterEnabled, toggleNewsletter,
    isSessionOnly, toggleSessionOnly,
    logout
  } = useStore();

  const styles = getStyles(isDarkMode);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <Text style={styles.settingsTitle}>Налаштування додатку</Text>

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
        <Switch value={isDarkMode} onValueChange={toggleTheme} color="#34C759" />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Сповіщення про оренду</Text>
        <Switch value={notificationsEnabled} onValueChange={toggleNotifications} color="#34C759" />
      </View>

      {/* Перемикач для Практичної №5 (Пункт 4) */}
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Тільки поточна сесія (не зберігати)</Text>
        <Switch value={isSessionOnly} onValueChange={toggleSessionOnly} color="#007AFF" />
      </View>

      <View style={[styles.settingItem, { borderBottomWidth: 0 }]}>
        <Text style={styles.settingText}>Отримувати новини на Email</Text>
        <Checkbox.Android status={newsletterEnabled ? 'checked' : 'unchecked'} onPress={toggleNewsletter} color="#007AFF" uncheckedColor={isDarkMode ? '#AAA' : '#666'} />
      </View>

      <Button mode="contained" onPress={logout} buttonColor="#FF3B30" style={{ marginTop: 24 }}>
        Вийти з акаунта
      </Button>
    </KeyboardAvoidingView>
  );
}

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: isDarkMode ? '#121212' : '#F5F5F7' },
  settingsTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 24, color: isDarkMode ? '#FFFFFF' : '#1C1C1E' },
  input: { marginBottom: 16, backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: isDarkMode ? '#333333' : '#E5E5EA' },
  settingText: { fontSize: 16, color: isDarkMode ? '#FFFFFF' : '#333333' }
});