import React, { useState, useContext } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { TextInput, Button, Text, Dialog, Portal, Paragraph, Appbar } from 'react-native-paper';
import { AppContext } from '../context/AppContext';

export default function LoginScreen() {
  const context = useContext(AppContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorVisible, setErrorVisible] = useState(false);

  // Отримуємо налаштування теми з глобального контексту
  const isDarkMode = context?.isDarkMode || false;
  const styles = getStyles(isDarkMode);

  const handleLogin = () => {
    // Викликаємо функцію login з AppContext
    const success = context?.login(username, password);
    if (!success) {
      // Якщо пароль невірний, показуємо модальне вікно з помилкою
      setErrorVisible(true);
    }
    // Якщо success === true, глобальний стан зміниться, 
    // і наш _layout.tsx автоматично перекине нас на головний екран!
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Appbar.Header style={{ backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }}>
        <Appbar.Content title="Авторизація" titleStyle={{ color: isDarkMode ? '#FFFFFF' : '#333333', fontWeight: 'bold' }} />
      </Appbar.Header>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Вітаємо у Carnival Rentals!</Text>
          <Text style={styles.subtitle}>Будь ласка, увійдіть (Логін: student, Пароль: 12345)</Text>

          <TextInput
            label="Логін"
            value={username}
            onChangeText={setUsername}
            mode="outlined"
            style={styles.input}
            textColor={isDarkMode ? '#FFF' : '#000'}
            activeOutlineColor="#007AFF"
            outlineColor={isDarkMode ? '#555' : '#CCC'}
            theme={{ colors: { onSurfaceVariant: isDarkMode ? '#AAA' : '#666' } }}
            autoCapitalize="none"
          />

          <TextInput
            label="Пароль"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            mode="outlined"
            style={styles.input}
            textColor={isDarkMode ? '#FFF' : '#000'}
            activeOutlineColor="#007AFF"
            outlineColor={isDarkMode ? '#555' : '#CCC'}
            theme={{ colors: { onSurfaceVariant: isDarkMode ? '#AAA' : '#666' } }}
          />

          <Button mode="contained" onPress={handleLogin} style={styles.button} buttonColor="#007AFF">
            Увійти
          </Button>
        </View>

        <Portal>
          <Dialog visible={errorVisible} onDismiss={() => setErrorVisible(false)} style={{ backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF' }}>
            <Dialog.Title style={{ color: isDarkMode ? '#FFF' : '#000' }}>Помилка входу</Dialog.Title>
            <Dialog.Content>
              <Paragraph style={{ color: isDarkMode ? '#AAA' : '#333' }}>Невірний логін або пароль. Спробуйте ще раз.</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setErrorVisible(false)} textColor="#007AFF">ОК</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: isDarkMode ? '#121212' : '#F5F5F7',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  formContainer: {
    backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDarkMode ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: isDarkMode ? '#FFFFFF' : '#1C1C1E',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: isDarkMode ? '#AAAAAA' : '#8E8E93',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
    backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
  },
  button: {
    marginTop: 8,
    paddingVertical: 6,
  },
});