import { useRouter } from 'expo-router'; // Виправили імпорт: використовуємо тільки expo-router
import React, { useContext, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { Button, Dialog, Paragraph, Portal, TextInput } from 'react-native-paper';
import { AppContext } from '../../context/AppContext';

export default function AddScreen() {
  const context = useContext(AppContext);
  const router = useRouter();
  const isDarkMode = context?.isDarkMode || false;

  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [validationDialogVisible, setValidationDialogVisible] = useState(false);

  const handleAddCostume = () => {
    if (newName.trim() === '' || newCategory.trim() === '' || newPrice.trim() === '') {
      setValidationDialogVisible(true);
      return;
    }

    if (context) {
      context.setCostumesData(prevData => [
        {
          id: Date.now().toString(),
          name: newName,
          category: newCategory,
          price: `${newPrice} грн/доба`,
          description: newDescription.trim() === '' ? 'Опис відсутній.' : newDescription,
        },
        ...prevData
      ]);
    }

    setNewName('');
    setNewCategory('');
    setNewPrice('');
    setNewDescription('');

    // Повертаємось на вкладку каталогу після додавання
    router.replace('/(tabs)');
  };

  const styles = getStyles(isDarkMode);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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

        <Button mode="contained" onPress={handleAddCostume} style={styles.button} buttonColor="#007AFF">
          Зберегти костюм
        </Button>
      </ScrollView>

      <Portal>
        <Dialog visible={validationDialogVisible} onDismiss={() => setValidationDialogVisible(false)} style={{ backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF' }}>
          <Dialog.Title style={{ color: isDarkMode ? '#FFF' : '#000' }}>Помилка</Dialog.Title>
          <Dialog.Content>
            <Paragraph style={{ color: isDarkMode ? '#AAA' : '#333' }}>Будь ласка, заповніть всі обов'язкові поля.</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setValidationDialogVisible(false)} textColor="#007AFF">ОК</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </KeyboardAvoidingView>
  );
}

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? '#121212' : '#F5F5F7',
  },
  scrollContainer: {
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