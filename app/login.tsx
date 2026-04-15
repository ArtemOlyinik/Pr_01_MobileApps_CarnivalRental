import React, { useContext, useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Appbar, Button, Dialog, Paragraph, Portal, Text, TextInput } from 'react-native-paper';
import { AppContext } from '../context/AppContext';

export default function LoginScreen() {
  const context = useContext(AppContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorVisible, setErrorVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isDarkMode = context?.isDarkMode || false;
  const styles = getStyles(isDarkMode);

  const handleLogin = async () => {
    if (!username || !password) return;

    setIsLoading(true);
    const success = await context?.login(username, password);
    setIsLoading(false);

    if (!success) {
      setErrorVisible(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Appbar.Header style={{ backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }}>
        <Appbar.Content 
            title="Авторизація через API" 
            titleStyle={{ color: isDarkMode ? '#FFFFFF' : '#333333', fontWeight: 'bold' }} 
        />
      </Appbar.Header>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Вхід у систему</Text>
          <Text style={styles.subtitle}>Використовуйте дані ReqRes для тестування</Text>

          <TextInput
            label="Email (напр. eve.holt@reqres.in)"
            value={username}
            onChangeText={setUsername}
            mode="outlined"
            disabled={isLoading}
            style={styles.input}
            textColor={isDarkMode ? '#FFF' : '#000'}
            activeOutlineColor="#007AFF"
            outlineColor={isDarkMode ? '#555' : '#CCC'}
            theme={{ colors: { onSurfaceVariant: isDarkMode ? '#AAA' : '#666' } }}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            label="Пароль"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            disabled={isLoading}
            mode="outlined"
            style={styles.input}
            textColor={isDarkMode ? '#FFF' : '#000'}
            activeOutlineColor="#007AFF"
            outlineColor={isDarkMode ? '#555' : '#CCC'}
            theme={{ colors: { onSurfaceVariant: isDarkMode ? '#AAA' : '#666' } }}
          />

          {isLoading ? (
            <ActivityIndicator animating={true} color="#007AFF" style={{ marginVertical: 10 }} />
          ) : (
            <Button 
              mode="contained" 
              onPress={handleLogin} 
              style={styles.button} 
              buttonColor="#007AFF"
            >
              Увійти
            </Button>
          )}
        </View>

        <Portal>
          <Dialog visible={errorVisible} onDismiss={() => setErrorVisible(false)} style={{ backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF' }}>
            <Dialog.Title style={{ color: isDarkMode ? '#FFF' : '#000' }}>Помилка API</Dialog.Title>
            <Dialog.Content>
              <Paragraph style={{ color: isDarkMode ? '#AAA' : '#333' }}>
                Не вдалося авторизуватися. Перевірте логін (email) та пароль.
              </Paragraph>
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