import React, { useContext, useState } from 'react';
// ПРИБРАНО SafeAreaView з react-native
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
// ДОДАНО SafeAreaView з нової бібліотеки
import { ActivityIndicator, Appbar, Button, Dialog, Paragraph, Portal, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext } from '../context/AppContext';

export default function LoginScreen() {
  const context = useContext(AppContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);

  const isDarkMode = context?.isDarkMode || false;
  const styles = getStyles(isDarkMode);

  const handleLogin = async () => {
    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    if (!cleanUsername || !cleanPassword) return;

    setIsLoading(true);
    const result = await context?.login(cleanUsername, cleanPassword);
    
    if (result?.success) {
      return; 
    }

    setIsLoading(false);
    setErrorMessage(result?.message || 'Невідома помилка');
    setErrorVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Appbar.Header style={{ backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }}>
        <Appbar.Content title="Авторизація через API" titleStyle={{ color: isDarkMode ? '#FFFFFF' : '#333333', fontWeight: 'bold' }} />
      </Appbar.Header>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Вхід у систему</Text>
          <Text style={styles.subtitle}>Тестові дані DummyJSON</Text>

          <TextInput
            label="Логін (напр. emilys)"
            value={username}
            onChangeText={setUsername}
            mode="outlined"
            disabled={isLoading}
            style={styles.input}
            textColor={isDarkMode ? '#FFF' : '#000'}
            activeOutlineColor="#007AFF"
            autoCapitalize="none"
            autoCorrect={false} 
          />

          <TextInput
            label="Пароль (emilyspass)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            disabled={isLoading}
            mode="outlined"
            style={styles.input}
            textColor={isDarkMode ? '#FFF' : '#000'}
            activeOutlineColor="#007AFF"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {isLoading ? (
            <ActivityIndicator animating={true} color="#007AFF" style={{ marginVertical: 10 }} />
          ) : (
            <Button mode="contained" onPress={handleLogin} style={styles.button} buttonColor="#007AFF">
              Увійти
            </Button>
          )}
        </View>

        <Portal>
          <Dialog visible={errorVisible} onDismiss={() => setErrorVisible(false)} style={{ backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF' }}>
            <Dialog.Title style={{ color: isDarkMode ? '#FFF' : '#000' }}>Деталі Помилки</Dialog.Title>
            <Dialog.Content>
              <Paragraph style={{ color: isDarkMode ? '#AAA' : '#333', fontWeight: 'bold' }}>
                {errorMessage}
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
  safeArea: { flex: 1, backgroundColor: isDarkMode ? '#121212' : '#F5F5F7' },
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  formContainer: { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF', padding: 24, borderRadius: 12, elevation: 3 },
  title: { fontSize: 22, fontWeight: 'bold', color: isDarkMode ? '#FFFFFF' : '#1C1C1E', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 14, color: isDarkMode ? '#AAAAAA' : '#8E8E93', marginBottom: 24, textAlign: 'center' },
  input: { marginBottom: 16, backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' },
  button: { marginTop: 8, paddingVertical: 6 },
});