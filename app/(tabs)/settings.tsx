import React, { useEffect } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Button, Checkbox, Switch, Text, TextInput } from 'react-native-paper';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useStore } from '../../store/useStore';

const AnimatedKeyboardAvoidingView = Animated.createAnimatedComponent(KeyboardAvoidingView);

export default function SettingsScreen() {
  const {
    isDarkMode, toggleTheme,
    userName, setUserName,
    notificationsEnabled, toggleNotifications,
    newsletterEnabled, toggleNewsletter,
    isSessionOnly, toggleSessionOnly,
    logout
  } = useStore();

  const styles = getStyles(isDarkMode);

  // Animated background value
  const themeProgress = useSharedValue(isDarkMode ? 1 : 0);

  useEffect(() => {
    themeProgress.value = withTiming(isDarkMode ? 1 : 0, { duration: 500 });
  }, [isDarkMode]);

  // We can't directly animate interpolateColor in some environments without useDerivedValue, 
  // but Reanimated 3 supports it natively in useAnimatedStyle.
  const animatedBgStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        themeProgress.value,
        [0, 1],
        ['#F5F5F7', '#121212']
      )
    };
  });

  return (
    <AnimatedKeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={[styles.container, animatedBgStyle]}>
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
    </AnimatedKeyboardAvoidingView>
  );
}

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: isDarkMode ? '#121212' : '#F5F5F7' },
  settingsTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 24, color: isDarkMode ? '#FFFFFF' : '#1C1C1E' },
  input: { marginBottom: 16, backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: isDarkMode ? '#333333' : '#E5E5EA' },
  settingText: { fontSize: 16, color: isDarkMode ? '#FFFFFF' : '#333333' }
});